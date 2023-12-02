const express = require("express");

const cors = require("cors");
const res = require("express/lib/response");
const req = require("express/lib/request");
const contactsRouter = require("./app/routes/contact.route");
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.json({message: "Wellcom to contact book application." });
});

app.use("/api/contacts", contactsRouter);

// handle 404 response
app.use((req, res, next) => {
// Code ở đây sẽ chạy khi không có route được định nghĩa nào khớp với yêu cầu. Gọi next() để chuyển sang middleware xử lý lỗi
    return next(new ApiError(404, "Resource not found"));
});
app.use((err, req, res, next) => {
// Trong các đoạn code xử lý ở các route, gọi next(error) sẽ chuyển về middleware xử lý lỗi này
    return res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
    });
});


module.exports = app;
