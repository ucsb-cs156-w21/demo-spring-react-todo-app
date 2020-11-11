import React, { useState } from "react";
import {Button, Col, Row, Container, Form} from "react-bootstrap";
import {toast} from "react-toastify";
export const TodoUploadButton = ({ addTask }) => {
    const [value, setValue] = useState("");
    const [file, setFile] = React.useState(null);
    const fileRef = React.useRef();
    return (
        <form
            onSubmit={async (event) => {
                event.preventDefault();
                try{
                    await addTask(file);
                } catch(error){
                    if(error.message.split(" ")[0] === "HTTP") {
                        toast.error(error.message, {
                            position: "top-right",
                            autoClose: 3500,
                            closeOnClick: true,
                            pauseOnHover: false
                        });
                    }
                }
                fileRef.current.value = "";
                setFile(null);
                setValue("");
            }}
        >
            <Container fluid>
                <Row style={{paddingTop: 14}}>
                    <Col xs={11} style={{ padding: 0 }}>
                        <Form.Group>
                            <Form.File
                                type="file"
                                accept=".csv"
                                id="custom-file-input"
                                label="Upload a CSV"
                                custom
                                onChange={event => {setFile(event.currentTarget.files[0])}}
                                ref={fileRef}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={1} style={{ padding: 0 }}>
                        <Button type="submit">Submit</Button>
                    </Col>
                </Row>
            </Container>
        </form>
    );
};
