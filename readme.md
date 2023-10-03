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
- **Get all Employees**

  - Method: GET
  - Endpoint: `api/employee/`

- **Filter Employees**
  - Method: POST
  - Endpoint: `api/employee/filter`
  - Request Body:
    ```json
    {
      "field": "email",
      "value": "employee@email.com"
    }
    ```

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
        "Completion 1 object",
        "Completion 2 object",
        "Completion 3 object",
        "Completion 4 object"
      ], // Array of completion strings
      "taskType": "S1Review", // Task type (fresh, re-work, S1Review, S2Review)
      "ranking": "High", // Ranking as a string
      "reasoning": "This annotation is of high quality." // Reasoning for the annotation
    }
    ```
  - Comment: Design your own **_array_of_objects_** stucture to contain completions and their corresponding questions.

- **Update Annotation**

  - Method: PATCH
  - Endpoint: `api/annotations/:id`
  - Request Body:
    ```json
    {
      "field_name": "new_field_value"
    }
    ```

- **Delete Annotation**

  - Method: DELETE
  - Endpoint: `api/annotations/:id`

- **Get Annotation by ID**

  - Method: GET
  - Endpoint: `api/annotations/:id`

- **Get All Annotation**

  - Method: GET
  - Endpoint: `api/annotations/?page=N`

- **Filter Annotations**
  - Method: POST
  - Endpoint: `api/annotations/filter/?page=N`
  - Request Body:
    ```json
    {
      "field": "taskType",
      "value": "fresh"
    }
    ```
- **Filter Annotations By Date**
  - Method: POST
  - Endpoint: `api/annotations/filterByDate/`
  - Request Body:
    ```json
    {
      "fromDate": "2023-09-28",
      "fromTime": "00:00:00",
      "toDate": "2023-09-28",
      "toTime": "24:00:00",
      "groupBy": "annotatorEmail" // or language, etc
    }
    ```
  - Comment: Keeping the `groupBy` field empty will return all annotations for that date range

### Response structure

All endpoints, regardless of module, will produce the following response structure with appropriate values.

```json
{
  "success": true, // or false
  "message": "<data>", // Array, Object, or String
  "pagination": "<pagination_object>", // if any
  "error": "<ERROR_OBJECT>" // if any
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
