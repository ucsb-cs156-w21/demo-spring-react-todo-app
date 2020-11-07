package com.ucsb.demonextjsspringtodoapp.controllers;

import com.ucsb.demonextjsspringtodoapp.services.CSVToObjectService;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;
import javax.validation.Valid;
import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ucsb.demonextjsspringtodoapp.models.Todo;
import com.ucsb.demonextjsspringtodoapp.repositories.TodoRepository;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class TodoController {
  private final Logger logger = LoggerFactory.getLogger(TodoController.class);

  @Autowired
  private TodoRepository todoRepository;

  @Autowired
  CSVToObjectService<Todo> csvToObjectService;

  private ObjectMapper mapper = new ObjectMapper();

  @PostMapping(value = "/api/todos", produces = "application/json")
  public ResponseEntity<String> createTodo(@RequestHeader("Authorization") String authorization,
      @RequestBody @Valid Todo todo) throws JsonProcessingException {
    DecodedJWT jwt = JWT.decode(authorization.substring(7));
    todo.setUserId(jwt.getSubject());
    Todo savedTodo = todoRepository.save(todo);
    String body = mapper.writeValueAsString(savedTodo);
    return ResponseEntity.ok().body(body);
  }

  @PutMapping(value = "/api/todos/{id}", produces = "application/json")
  public ResponseEntity<String> updateTodo(@RequestHeader("Authorization") String authorization,
      @PathVariable("id") Long id, @RequestBody @Valid Todo incomingTodo)
      throws JsonProcessingException {
    DecodedJWT jwt = JWT.decode(authorization.substring(7));
    Optional<Todo> todo = todoRepository.findById(id);
    if (!todo.isPresent() || !todo.get().getUserId().equals(jwt.getSubject())) {
      return ResponseEntity.notFound().build();
    }

    if (!incomingTodo.getId().equals(id) || !incomingTodo.getUserId().equals(jwt.getSubject())) {
      return ResponseEntity.badRequest().build();
    }

    todoRepository.save(incomingTodo);
    String body = mapper.writeValueAsString(incomingTodo);
    return ResponseEntity.ok().body(body);
  }

  @DeleteMapping(value = "/api/todos/{id}", produces = "application/json")
  public ResponseEntity<String> deleteTodo(@RequestHeader("Authorization") String authorization,
      @PathVariable("id") Long id) {
    DecodedJWT jwt = JWT.decode(authorization.substring(7));
    Optional<Todo> todo = todoRepository.findById(id);
    if (!todo.isPresent() || !todo.get().getUserId().equals(jwt.getSubject())) {
      return ResponseEntity.notFound().build();
    }
    todoRepository.deleteById(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping(value = "/api/todos", produces = "application/json")
  public ResponseEntity<String> getUserTodos(@RequestHeader("Authorization") String authorization)
      throws JsonProcessingException {
    DecodedJWT jwt = JWT.decode(authorization.substring(7));
    List<Todo> todoList = todoRepository.findByUserId(jwt.getSubject());
    ObjectMapper mapper = new ObjectMapper();

    String body = mapper.writeValueAsString(todoList);
    return ResponseEntity.ok().body(body);
  }

  @PostMapping(value = "/api/todos/upload", produces = "application/json")
  public ResponseEntity<String> uploadCSV(@RequestParam("csv") MultipartFile csv, @RequestHeader("Authorization") String authorization)
          throws JsonProcessingException {
    String error = "";
    DecodedJWT jwt = JWT.decode(authorization.substring(7));
    try(Reader reader = new InputStreamReader(csv.getInputStream())){
      logger.info(new String(csv.getInputStream().readAllBytes()));
      List<Todo> todos = csvToObjectService.parse(reader, Todo.class);
      for (Todo todo : todos) {
        todo.setUserId(jwt.getSubject());
      }
      List<Todo> savedTodos = (List<Todo>) todoRepository.saveAll(todos);
      String body = mapper.writeValueAsString(savedTodos);
      return ResponseEntity.ok().body(body);
    } catch(IOException e){
      logger.error(e.toString());
    } catch(RuntimeException e){
      error = "CSV could not be parsed " + e.getLocalizedMessage();
    }
    return ResponseEntity.badRequest().body(error);
  }


}
