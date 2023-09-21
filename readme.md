# RM-Annotation-Logs

RM-Annotation-Logs is a Node.js backend project designed to manage employee data, annotations, and related operations. It provides APIs for creating, updating, and querying annotations, as well as user authentication.

## API Endpoints

### Employee API

- **Employee Login**
  - Method: POST
  - Endpoint: `api/employee/login`
  - Request Body:
    ```json
    {
      "email": "employee@email.com",
      "password": "password"
    }
    ```
  - Comment: Needs more security. Will update later.

### Annotations API

- **Create Annotation**

  - Method: POST
  - Endpoint: `api/annotations/`
  - Request Body:
    ```json
    {
      "date": "2023-09-14", // Date in ISO format
      "annotatorEmail": "akassaha@deloitte.com", // Annotator's email
      "batchNumber": "BATCH-4", // Batch number as a string
      "prompt": "Please annotate this text - 5", // Annotation prompt
      "rejected": false, // Whether the annotation is rejected (true/false)
      "language": "Java", // Language as a string
      "completions": [
        "Completion 1",
        "Completion 2",
        "Completion 3",
        "Completion 4"
      ], // Array of completion strings
      "taskType": "S1Review", // Task type (fresh, re-work, S1Review, S2Review)
      "ranking": "High", // Ranking as a string
      "reasoning": "This annotation is of high quality." // Reasoning for the annotation
    }
    ```
  - Comment: Design your own _array_of_objects_ stucture to contain completions and their corresponding questions.

- **Update Annotation**

  - Method: PUT
  - Endpoint: `api/annotations/:id`
  - Request Body:
    ```json
    {
      "date": "2023-09-16",
      "completions": ["Updated Completion 1", "Updated Completion 2"]
    }
    ```

- **Delete Annotation**

  - Method: DELETE
  - Endpoint: `api/annotations/delete/:id`

- **Get Annotation by ID**

  - Method: GET
  - Endpoint: `api/annotations/get/:id`

- **Filter Annotations**
  - Method: POST
  - Endpoint: `api/annotations/filter`
  - Request Body:
    ```json
    {
      "field": "taskType",
      "value": "fresh"
    }
    ```

## Getting Started

To get started with the project, follow these steps:

1. Clone this repository to your local machine:

   ```
   git clone <repository-url>
   ```

2. Install project dependencies:

   ```
   npm install
   ```

3. Install nodemon globally:

   ```
   npm install -g nodemon
   ```

4. Set up your environment variables by creating a `.env` file and configuring the necessary values.
5. Modify the `config.json` file to set up your project-specific configuration, including database URLs and server port.
6. Start the server using nodemon:

   ```
   nodemon server.js
   ```

Now, the server should be running, and you can access the APIs.

## Contributing

Contributions to this project are welcome. You can fork this repository, make your changes, and submit a pull request.
