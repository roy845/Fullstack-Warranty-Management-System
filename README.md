# Fullstack Warranty Management System

A fullstack system for managing warranties, users, and warranties registrations — built with:

- **NestJS (Backend API)**
- **React-Admin (Admin Dashboard)**
- **React Native + Expo (Mobile App)**

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Key Features](#key-features)
3. [Deployment Links](#deployment-links)
4. [Admin Login Credentials](#admin-login-credentials)
5. [Local Setup Instructions](#local-setup-instructions)
   - [1. Clone the Repository](#1-clone-the-repository)
   - [2. Environment Variables](#2-environment-variables)
   - [3. Install Dependencies](#3-install-dependencies)
   - [4. Run the Applications](#4-run-the-applications)
6. [Project Structure](#project-structure)
7. [System Architecture](#system-architecture)
8. [Technologies Used](#technologies-used)
9. [Screenshots](#screenshots)
   - [Swagger Docs](#swagger-docs)
   - [Mobile App](#mobile-app)
   - [React-Admin](#react-admin)
10. [Video Demonstrations](#video-demonstrations)

## System Overview

This project provides a complete warranty management platform, including:

- **Admin Dashboard**: Manage users, and warranties via a React-Admin interface.
- **Mobile App**: Installers can:
  1. signup the app.
  2. login into the app.
  3. register/submit warranties by fill in customer details and uploading invoice.
- **Backend API**: Secure RESTful services with authentication, authorization, and data management.

### Key features

- JWT Authentication & Role-based Authorization (RBAC)
- Admin CRUD Operations
- Mobile warranty registration
- MongoDB with Mongoose ORM
- Swagger API documentation
- Error handling and validation
- Light/Dark mode support

---

## Deployment Links

Admin Panel and Swagger API Docs can take a while to load because they are host on render free tier which slows down the connection if we don't enter it regulary every 15 minutes.

| Component            | URL                                                                                                                        |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| **Admin Panel**      | [https://tadiran-assignment-react-admin.onrender.com/#/login](https://tadiran-assignment-react-admin.onrender.com/#/login) |
| **Swagger API Docs** | [https://tadiran-assignment.onrender.com/api/swagger/docs](https://tadiran-assignment.onrender.com/api/swagger/docs)       |
| **Mobile App**       | [Expo Project Link](https://expo.dev/accounts/royatali94/projects/frontend/builds/65d467b5-45ab-4c48-898c-da4e4ef46497)    |

---

## Admin Login Credentials

| Field        | Value                  |
| :----------- | :--------------------- |
| **Email**    | `royatali94@gmail.com` |
| **Password** | `Aa123456@`            |

---

## Local Setup Instructions

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Mongoose database
- Expo CLI installed globally

### 1. Clone the Repository

```bash
git clone https://github.com/roy845/Fullstack-Warranty-Management-System.git
```

## 2. Environment Variables

Create `.env` files in each project:

### `/backend/.env`

```env
PORT=
MONGO_INITDB_ROOT_USERNAME=
MONGO_INITDB_ROOT_PASSWORD=
MONGO_DB_NAME=
MONGO_PORT=
MONGO_HOST=
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=
JWT_REFRESH_TOKEN_SECRET=
JWT_REFRESH_TOKEN_EXPIRES_IN=
ADMIN_USER_PASSWORD=
MINDEE_API_KEY=
MINDEE_URL=
```

### `/mobile/.env`

```env
EXPO_PUBLIC_API_URL_PROD=
EXPO_PUBLIC_API_URL_DEV=
```

### `/admin/.env`

```env
VITE_API_URL_PROD=
VITE_API_URL_DEV=
```

## 3. Install Dependencies

## Backend

cd backend
npm install

## Admin

cd ../admin
npm install

## Mobile

cd ../mobile
npm install

## 4. Run the Applications

## Start Backend

    cd backend
    npm run start:dev

## Start Admin

    cd admin
    npm run dev

## Start Mobile App

    cd mobile
    npx expo start -c

## Project Structure

<b> /backend - </b> NestJS API server
<b> /admin - </b> React-Admin frontend
<b> /mobile - </b> React Native Expo app

## System Architecture

![alt text](assets/tadiran_system_arch.png)

## Technologies Used

|                                          Logo                                           | Technology              | Purpose                           |
| :-------------------------------------------------------------------------------------: | :---------------------- | :-------------------------------- |
|    ![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)    | **NestJS**              | Backend framework                 |
|  ![React](https://img.shields.io/badge/React_Admin-61DAFB?logo=react&logoColor=white)   | **React-Admin**         | Admin dashboard                   |
|       ![Expo](https://img.shields.io/badge/Expo-000020?logo=expo&logoColor=white)       | **Expo (React Native)** | Mobile App development            |
|  ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)   | **MongoDB**             | NoSQL Database                    |
| ![Mongoose](https://img.shields.io/badge/Mongoose-880000?logo=mongoose&logoColor=white) | **Mongoose**            | ODM for MongoDB                   |
|                                           🔒                                            | **JWT + bcrypt**        | Authentication & Password Hashing |
|  ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=black)   | **Swagger**             | API Documentation                 |
|                                           🛡️                                            | **Zod**                 | Validation schemas                |
|    ![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)    | **Docker**              | Containerization & Deployment     |

## Screenshots

## Server

## Root Page (Index)

![alt text](./assets/main-server-page.png)

## Not Found Page

![alt text](./assets/not-found-page.png)

## Swagger Docs

![alt text](./assets/image.png)
![alt text](./assets/image-1.png)
![alt text](./assets/image-2.png)

---

## Mobile-App

## Menu

![alt text](./assets/menu.jpg)

## Register

![alt text](./assets/register.jpg)

## Login

![alt text](./assets/login.jpg)

## Forgot Password

![alt text](./assets/forgot_password.jpg)

## Reset Password

![alt text](./assets/reset_password.jpg)

## Create Warranty

![alt text](./assets/create_warranty.jpg)

## Warranty List

![alt text](./assets/warranties_list.jpg)

## Profile

![alt text](./assets/profile.jpg)

## Edit Profile

![alt text](./assets/edit_profile.jpg)

## Settings

![alt text](./assets/settings.jpg)

---

## React-Admin

## Login

![alt text](./assets/react-admin-login.png)

## Dashboard

![alt text](./assets/dashboard.png)

## Users

![alt text](./assets/users.png)

## Warranties

![alt text](./assets/warranties.png)

## Edit Warranty

![alt text](./assets/edit-warranty.png)

## Video Demonstrations

## Mobile App

Click on the image and you will redirect to the video page

[![Watch the video](https://i.ibb.co/Kp6QcZKp/2025-04-29-075953.png)](https://www.youtube.com/shorts/gbTi3kKlOv4)

## React-Admin

Click on the image and you will redirect to the video page

[![Watch the video](https://i.ibb.co/PvyTTDwY/2025-04-29-080913.png)](https://www.youtube.com/watch?v=o8VG_P8jdpE)
