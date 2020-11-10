import React from "react";
import { waitFor, render } from "@testing-library/react";
import useSWR from "swr";
jest.mock("swr");
import { useAuth0 } from "@auth0/auth0-react";
jest.mock("@auth0/auth0-react");
import userEvent from "@testing-library/user-event";
import { fetchWithToken } from "main/utils/fetch";
import {TodoUploadButton} from "../../../main/pages/Todos/TodoUploadButton";
jest.mock("main/utils/fetch");
describe("TodoUpload test", () => {
    const user = {
        name: "test user",
    };
    const todos = [
        {
            value: "incomplete todo",
            id: 1,
            done: false,
        },
        {
            value: "complete todo",
            id: 2,
            done: true,
        },
    ];
    const getAccessTokenSilentlySpy = jest.fn();
    const mutateSpy = jest.fn();
    beforeEach(() => {
        useAuth0.mockReturnValue({
            user,
            getAccessTokenSilently: getAccessTokenSilentlySpy,
        });
        useSWR.mockReturnValue({
            data: todos,
            error: undefined,
            mutate: mutateSpy,
        });
    });
    test("renders without crashing", () => {
        render(<TodoUploadButton />);
    });

});
