// FileUpload.test.js

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FileUpload from "./FileUpload";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

// Set up mock axios
const mockAxios = new MockAdapter(axios);

describe("FileUpload Component", () => {
  // Clean up after each test
  afterEach(() => {
    mockAxios.reset();
  });

  test("renders file upload form and button", () => {
    render(<FileUpload />);

    expect(screen.getByText("Upload File")).toBeInTheDocument();
    expect(screen.getByText("Upload")).toBeInTheDocument();
  });

  test("uploads a file and displays the result", async () => {
    const mockFile = new File(["dummy content"], "example.txt", {
      type: "text/plain",
    });

    const mockFileData = {
      id: 1,
      name: "example.txt",
      extractedData: {
        pii: {
          emails: ["test@example.com"],
        },
      },
    };

    mockAxios.onPost("http://localhost:5000/upload").reply(200, {
      savedFile: mockFileData,
    });

    render(<FileUpload />);

    // Simulate selecting a file
    fireEvent.change(screen.getByLabelText("Choose File"), {
      target: { files: [mockFile] },
    });

    // Simulate form submission
    fireEvent.click(screen.getByText("Upload"));

    // Check if the file has been uploaded and displayed in the file list
    await waitFor(() => expect(screen.getByText("Scanned Data for: example.txt")).toBeInTheDocument());
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  test("handles file upload failure", async () => {
    const mockFile = new File(["dummy content"], "example.txt", {
      type: "text/plain",
    });

    mockAxios.onPost("http://localhost:5000/upload").reply(500);

    render(<FileUpload />);

    // Simulate selecting a file
    fireEvent.change(screen.getByLabelText("Choose File"), {
      target: { files: [mockFile] },
    });

    // Simulate form submission
    fireEvent.click(screen.getByText("Upload"));

    // Wait for error message to appear
    await waitFor(() => expect(screen.getByText("Error uploading file.")).toBeInTheDocument());
  });

  test("fetches and displays uploaded files", async () => {
    const mockFileData = [
      {
        id: 1,
        name: "example.txt",
        extractedData: {
          pii: {
            emails: ["test@example.com"],
          },
        },
      },
    ];

    mockAxios.onGet("http://localhost:5000/scanned-files").reply(200, mockFileData);

    render(<FileUpload />);

    // Wait for the file to be listed in the UI
    await waitFor(() =>
      expect(screen.getByText("Scanned Data for: example.txt")).toBeInTheDocument()
    );
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  test("deletes an uploaded file", async () => {
    const mockFileData = [
      {
        id: 1,
        name: "example.txt",
        extractedData: {
          pii: {
            emails: ["test@example.com"],
          },
        },
      },
    ];

    mockAxios.onGet("http://localhost:5000/scanned-files").reply(200, mockFileData);
    mockAxios.onDelete("http://localhost:5000/delete").reply(200);

    render(<FileUpload />);

    // Wait for the file to be listed
    await waitFor(() =>
      expect(screen.getByText("Scanned Data for: example.txt")).toBeInTheDocument()
    );

    // Simulate delete action
    fireEvent.click(screen.getByText("Delete"));

    // Wait for the file to be removed from the list
    await waitFor(() => expect(screen.queryByText("example.txt")).toBeNull());
  });
});
