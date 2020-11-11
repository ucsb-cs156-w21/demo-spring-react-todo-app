package com.ucsb.demonextjsspringtodoapp.controllers;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.ucsb.demonextjsspringtodoapp.services.CSVToObjectService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.List;
import java.util.Optional;
import javax.validation.Valid;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ucsb.demonextjsspringtodoapp.advice.AuthControllerAdvice;
import com.ucsb.demonextjsspringtodoapp.entities.AppUser;
import com.ucsb.demonextjsspringtodoapp.entities.Todo;
import com.ucsb.demonextjsspringtodoapp.repositories.TodoRepository;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class TodoController {
  private final Logger logger = LoggerFactory.getLogger(TodoController.class);

  @Autowired
  private TodoRepository todoRepository;

  @Autowired
  CSVToObjectService<Todo> csvToObjectService;

  @Autowired
  private AuthControllerAdvice authControllerAdvice;

  private ObjectMapper mapper = new ObjectMapper();

  @PostMapping(value = "/api/todos", produces = "application/json")
  public ResponseEntity<String> createTodo(@RequestHeader("Authorization") String authorization,
      @RequestBody @Valid Todo todo) throws JsonProcessingException {
    AppUser user = authControllerAdvice.getUser(authorization);
    todo.setUserId(user.getEmail());
    Todo savedTodo = todoRepository.save(todo);
    String body = mapper.writeValueAsString(savedTodo);
    return ResponseEntity.ok().body(body);
  }

  @PutMapping(value = "/api/todos/{id}", produces = "application/json")
  public ResponseEntity<String> updateTodo(@RequestHeader("Authorization") String authorization,
      @PathVariable("id") Long id, @RequestBody @Valid Todo incomingTodo)
      throws JsonProcessingException {
    AppUser user = authControllerAdvice.getUser(authorization);

    Optional<Todo> todo = todoRepository.findById(id);
    if (!todo.isPresent() || !todo.get().getUserId().equals(user.getEmail())) {
      return ResponseEntity.notFound().build();
    }

    if (!incomingTodo.getId().equals(id) || !incomingTodo.getUserId().equals(user.getEmail())) {
      return ResponseEntity.badRequest().build();
    }

    todoRepository.save(incomingTodo);
    String body = mapper.writeValueAsString(incomingTodo);
    return ResponseEntity.ok().body(body);
  }

  @DeleteMapping(value = "/api/todos/{id}", produces = "application/json")
  public ResponseEntity<String> deleteTodo(@RequestHeader("Authorization") String authorization,
      @PathVariable("id") Long id) {
    AppUser user = authControllerAdvice.getUser(authorization);

    Optional<Todo> todo = todoRepository.findById(id);
    if (!todo.isPresent() || !todo.get().getUserId().equals(user.getEmail())) {
      return ResponseEntity.notFound().build();
    }
    todoRepository.deleteById(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping(value = "/api/todos", produces = "application/json")
  public ResponseEntity<String> getUserTodos(@RequestHeader("Authorization") String authorization)
      throws JsonProcessingException {
    AppUser user = authControllerAdvice.getUser(authorization);
    List<Todo> todoList = todoRepository.findByUserId(user.getEmail());
    ObjectMapper mapper = new ObjectMapper();

    String body = mapper.writeValueAsString(todoList);
    return ResponseEntity.ok().body(body);
  }

  @PostMapping(value = "/api/todos/upload", produces = "application/json")
  public ResponseEntity<String> uploadCSV(@RequestParam("csv") MultipartFile csv, @RequestHeader("Authorization") String authorization) {
    String error = "";
    AppUser user = authControllerAdvice.getUser(authorization);
    try(Reader reader = new InputStreamReader(csv.getInputStream())){
      logger.info(new String(csv.getInputStream().readAllBytes()));
      List<Todo> todos = csvToObjectService.parse(reader, Todo.class);
      for (Todo todo : todos) {
        todo.setUserId(user.getEmail());
      }
      List<Todo> savedTodos = (List<Todo>) todoRepository.saveAll(todos);
      String body = mapper.writeValueAsString(savedTodos);
      return ResponseEntity.ok().body(body);
    } catch(IOException e){
      logger.error(e.toString());
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error processing CSV", e);
    } catch(RuntimeException e){
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Malformed CSV", e);
    }
  }


}
