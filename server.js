const express = require('express');
const app = express();
const port = 3000;

const axios = require('axios');

const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'sample',
    port: 3306,
    connectionLimit: 5
});

app.use(express.json());

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const options = {
    swaggerDefinition: {
        info: {
            title: 'CRUD operations using ExpressJS',
            version: '1.0.0',
            description: 'CRUD operations using ExpressJS and MariaDB with Swagger documentation'
        },
        host: '204.48.23.36:3000',
        basePath: '/',
    },
    apis: ['./server.js'],
};

const specs = swaggerJsdoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());


/**
 * @swagger
 * /company:
 *    get:
 *      description: Return all companies
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: array of all company objects
 * 
 */
app.get('/company', (req, res) => {
    pool.getConnection()
        .then(conn => {

            conn.query("SELECT * FROM company;")
                .then((rows) => {
                    res.json(rows);
                    conn.release();
                })
                .catch(err => {
                    conn.release();
                    console.error(err);
                });
        })
        .catch(err => {
            console.error(err);
            res.status(503);
            var result = {
                "status": "Internal error",
                "affectedRows": 0,
                "object": req.body
            }
            res.json(result);
        });
});

/**
 * @swagger
 * /customers/{country}:
 *    get:
 *      description: Return all customers by country specified
 *      produces:
 *          - application/json
 *      parameters:
 *         - name: country
 *           in: path
 *           description: country name of the customers
 *           required: true
 *           schema:
 *           type: string
 *           format: string
 *      responses:
 *          200:
 *              description: array of all customer objects with specified country
 * 
 */
app.get('/customers/:country', (req, res) => {
    var country = '';
    var where = ''
    if (req.params.country != null) {
        where = 'where CUST_COUNTRY = "' + req.params.country + '";';
    }
    pool.getConnection()
        .then(conn => {

            conn.query("SELECT * fROM customer " + where)
                .then((rows) => {
                    res.json(rows);
                    conn.release();
                })
                .catch(err => {
                    console.error(err);
                    conn.release();
                });
        })
        .catch(err => {
            console.error(err);
            res.status(503);
            var result = {
                "status": "Internal error",
                "affectedRows": 0,
                "object": req.body
            }
            res.json(result);
        });
});

/**
 * @swagger
 * /foods:
 *    get:
 *      description: Return all food items
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: array of all food objects
 * 
 */
app.get('/foods', (req, res) => {
    pool.getConnection()
        .then(conn => {

            conn.query("SELECT * FROM foods;")
                .then((rows) => {
                    res.json(rows);
                    conn.release();
                })
                .catch(err => {
                    console.error(err);
                    conn.release();
                });
        })
        .catch(err => {
            console.error(err);
            res.status(503);
            var result = {
                "status": "Internal error",
                "affectedRows": 0,
                "object": req.body
            }
            res.json(result);
        });
});

/**
 * @swagger
 * /students:
 *    get:
 *      description: Return all students
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: array of all students
 * 
 */
app.get('/students', (req, res) => {
    pool.getConnection()
        .then(conn => {

            conn.query("SELECT * FROM student;")
                .then((rows) => {
                    res.json(rows);
                    conn.release();
                })
                .catch(err => {
                    console.error(err);
                    conn.release();
                });
        })
        .catch(err => {
            console.error(err);
            res.status(503);
            var result = {
                "status": "Internal error",
                "affectedRows": 0,
                "object": req.body
            }
            res.json(result);
            conn.release();
        });
});

/**
 * @swagger
 * /company:
 *    post:
 *      description: insert company
 *      consumes:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: company
 *            description: The company to create.
 *            schema:
 *              type: object
 *              required:
 *                - name
 *              properties:
 *               id:
 *                type: string
 *                name:
 *                  type: string
 *                city:
 *                  type: string         
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: new customer object
 */
app.post('/company', (req, res) => {
    var id = req.body.id;
    var name = req.body.name;
    var city = req.body.city;

    pool.getConnection()
        .then(conn => {

            query = "INSERT INTO company (COMPANY_ID,COMPANY_NAME,COMPANY_CITY) values (?,?,?)";

            conn.query(query, [id,name, city])
                .then((rows) => {
                    res.status(200);
                    var result = {
                        "status": "success",
                        "affectedRows": rows.affectedRows,
                        "object": req.body
                    }
                    res.json(result);
                    conn.release();
                })
                .catch(err => {
                    console.error(err);
                    res.status(200);
                    var result = {
                        "status": "failure",
                        "affectedRows": 0,
                        "object": req.body
                    }
                    res.json(result);
                    conn.release();
                });
        })
        .catch(err => {
            console.error(err);
            res.status(503);
            var result = {
                "status": "Internal error",
                "affectedRows": 0,
                "object": req.body
            }
            res.json(result);
        });
});

/**
 * @swagger
 * /company:
 *    delete:
 *      description: deletes company
 *      consumes:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: company
 *            description: The company to delete.
 *            schema:
 *              type: object
 *              required:
 *                - name
 *              properties:
 *                name:
 *                  type: string
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: response object
 */
app.delete('/company', (req, res) => {
    var name = req.body.name;

    pool.getConnection()
        .then(conn => {

            query = 'DELETE FROM company WHERE COMPANY_NAME = "' + name + '"';

            conn.query(query)
                .then((rows) => {
                    res.status(200);
                    var result = {
                        "status": "successful",
                        "affectedRows": rows.affectedRows,
                        "object": req.body
                    }
                    res.json(result);
                    conn.release();
                })
                .catch(err => {
                    console.error(err);
                    var result = {
                        "status": "failed",
                        "affectedRows": 0,
                        "object": req.body
                    }
                    res.json(result);
                    conn.release();
                })
        })
        .catch(err => {
            console.error(err);
            res.status(503);
            var result = {
                "status": "Internal error",
                "affectedRows": 0,
                "object": req.body
            }
            res.json(result);
        });
});

/**
 * @swagger
 * /food/name/{id}:
 *    patch:
 *      description: updates food item
 *      consumes:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: food
 *            description: The food to update.
 *            schema:
 *              type: object
 *              required:
 *                - name
 *              properties:
 *                name:
 *                  type: string
 *          - in: path
 *            name: id
 *            description: The food id.
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: response object
 */
app.patch('/food/name/:id', (req, res) => {

    if (req.params.id == null || req.params.id == "") {
        res.json({
            "status": "failure",
            "affectedRows": 0,
            "object": req.body
        });
        return;
    }

    pool.getConnection()
        .then(conn => {

            query = 'UPDATE foods SET ITEM_NAME="'+req.body.name+'" where ITEM_ID='+req.params.id+';';

            conn.query(query)
                .then((rows) => {
                    res.status(200);
                    var result = {
                        "status": "success",
                        "affectedRows": rows.affectedRows,
                        "object": req.body
                    }
                    res.json(result);
                    conn.release();
                })
                .catch(err => {
                    console.error(err);
                    res.status(200);
                    var result = {
                        "status": "failure",
                        "affectedRows": 0,
                        "object": req.body
                    }
                    res.json(result);
                    conn.release();
                });
        })
        .catch(err => {
            console.error(err);
            res.status(503);
            var result = {
                "status": "Internal error",
                "affectedRows": 0,
                "object": req.body
            }
            res.json(result);
        });
});

/**
 * @swagger
 * /student/{class}/{section}/{rollId}:
 *    put:
 *      description: Upserts the student record.
 *      consumes:
 *          - application/json
 *      parameters:
 *          - in: body
 *            name: name
 *            description: The student name to update.
 *            schema:
 *              type: object
 *              required:
 *                - name
 *              properties:
 *                name:
 *                  type: string
 *                title:
 *                  type: string
 *          - in: path
 *            name: class
 *            description: The class which the student belongs to.
 *          - in: path
 *            name: section
 *            description: The section which the student belongs to.
 *          - in: path
 *            name: rollId
 *            description: The roll ID of the student.
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: response object
 */
app.put('/student/:class/:section/:rollId', (req, res) => {

    if (req.params.rollId == null || req.params.rollId == "") {
        res.json({
            "status": "failure",
            "affectedRows": 0,
            "object": req.body
        });
        return;
    }

    pool.getConnection()
        .then(conn => {
            query = 'UPDATE student SET NAME="'+req.body.name+'",';
            query += 'TITLE="'+req.body.title+'"';
            query += 'WHERE CLASS="'+req.params.class+'"';
            query += 'AND SECTION="'+req.params.section+'"';
            query += 'AND ROLLID='+req.params.rollId+';';

            conn.query(query)
                .then((rows) => {

                    if (rows.affectedRows > 0)
                    {
                        res.status(200);
                        var result = {
                            "operation":"update",
                            "status": "success",
                            "affectedRows": rows.affectedRows,
                            "object": req.body
                        }
                        res.json(result);
                        conn.release();
                    }
                    else
                    {
                        query = "INSERT INTO student (NAME,TITLE,CLASS,SECTION,ROLLID) values (?,?,?,?,?)";

                        conn.query(query, [req.body.name, req.body.title, req.params.class, req.params.section, req.params.rollId])
                            .then((rows) => {
                                res.status(200);
                                var result = {
                                    "operation":"insert",
                                    "status": "success",
                                    "affectedRows": rows.affectedRows,
                                    "object": req.body
                                }
                                res.json(result);
                                conn.release();
                            })
                            .catch(err => {
                                console.error(err);
                                res.status(200);
                                var result = {
                                    "status": "failure",
                                    "affectedRows": 0,
                                    "object": req.body
                                }
                                res.json(result);
                                conn.release();
                            });
                    }
                    
                })
                .catch(err => {
                    console.error(err);
                    res.status(200);
                    var result = {
                        "status": "failure",
                        "affectedRows": 0,
                        "object": req.body
                    }
                    res.json(result);
                    conn.release();
                });
        })
        .catch(err => {
            console.error(err);
            res.status(503);
            var result = {
                "status": "Internal error",
                "affectedRows": 0,
                "object": req.body
            }
            res.json(result);
        });
});

/**
 * @swagger
 * /say:
 *    get:
 *      description: Returns a custom message from the lambda function hosted on AWS
 *      produces:
 *          - application/json
 *      parameters:
 *         - name: keyword
 *           in: query
 *           description: keyword to embed in a sentence.
 *           required: true
 *           schema:
 *           type: string
 *           format: string
 *      responses:
 *          200:
 *              description: custom message from the lambda function
 * 
 */
app.get('/say', async (req, res) => {

            var keyword = req.query.keyword;

            await axios.get(`https://vi7kd7jlq5.execute-api.us-east-2.amazonaws.com/main/say?keyword=` + keyword)
            .then(function (response) {
                res.json(response.data);
            })
            .catch(err => {
                console.error(err);
                res.status(503);
                var result = {
                    "status": "Internal error",
                    "object": req.body
                }
                res.json(result);
            });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
});
