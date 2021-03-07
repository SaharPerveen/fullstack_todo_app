const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    //console.log('db' + connection.state);
})


class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }
    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM tasks;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            //console.log(response);
            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async insertNewTask(task) {
        try {
            const dateAdded = new Date();
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO tasks(task, date_added) VALUES (?,?); ";

                connection.query(query, [task, dateAdded], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });

            return {
                id: insertId,
                task: task,
                dateAdded: dateAdded
            };

        } catch (error) {
            console.log(error);
        }
    }
    async deleteRowById(id) {
        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM tasks WHERE id = ?";

                connection.query(query, [id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });

            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }

    }
    async updateTaskById(id, task) {
        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE tasks SET task = ? WHERE id= ?";

                connection.query(query, [task, id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });

            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async searchByTask(task) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM tasks WHERE task = ?;";

                connection.query(query, [task], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response;

        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = DbService;