import express from "express";
import httpServer from "http";
import socket from "socket.io";
import { v4 as uuidV4 } from "uuid";

// const express = require("express");
// const httpServer = require("http");
// const socket = require("socket.io");
// const { v4: uuidV4 } = require("uuid");

/**
 * Define Variable
 */
// const { Request, Response } = express;

const app = express();
const server = new httpServer.Server(app);
const io = socket(server);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req, res) => {
  const { room } = req.params;

  res.render("room", { roomId: room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
  });
});

server.listen(3000);
