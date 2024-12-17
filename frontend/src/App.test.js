// App.test.js

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import UploadPage from "./FileUpload";

// Test if the App renders UploadPage at the root path
describe("App Component", () => {
  test("renders UploadPage at the root path", () => {
    render(
      <Router>
        <App />
      </Router>
    );

    // Check if UploadPage component is rendered
    expect(screen.getByText("Upload File")).toBeInTheDocument();
  });
});
