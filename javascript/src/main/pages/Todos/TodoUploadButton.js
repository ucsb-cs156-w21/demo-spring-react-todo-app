import React, { useState } from "react";
import {Button, Col, Row, Container, Form} from "react-bootstrap";
export const TodoUploadButton = ({ addTask }) => {
    const [value, setValue] = useState("");
    return (
        <form
            onSubmit={async (event) => {
                event.preventDefault();
                const file = event.currentTarget[0].files[0];
                try{
                    await addTask(file);
                } catch(error){
                    console.dir(error);
                }
                setValue("");
            }}
        >
            <Form.Group>
                <Form.File id="todo csv" label="Todos CSV" />
                <Button type="submit">Submit</Button>
            </Form.Group>
        </form>
    );
};
