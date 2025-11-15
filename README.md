# ⚡ Shrnk — Serverless URL Compression Service

**Shrnk** is a **serverless URL Compression Service** built with TypeScript and Express, deployed on AWS.  
It transforms long, unwieldy URLs into compact, efficient forms while operating entirely serverlessly, leveraging AWS cloud services for **scalability, high availability, and low maintenance**.

---

## 🚀 Overview

Shrnk provides a modern, lightweight system for **compressing URLs** into concise identifiers that are easy to share and manage.  
The service is fully serverless, powered by AWS Lambda, API Gateway, DynamoDB, S3, and CloudWatch, making it **highly scalable and cost-efficient**.

---

## 🏛️ Architecture

![Shrnk Architecture Diagram](s3://amzn-s3-image-store/Screenshot%202025-11-15%20at%206.37.40%E2%80%AFPM.png)

---

## 🌟 Key Highlights

- 🌍 **Serverless Architecture** — zero server provisioning or maintenance  
- ⚡ **Compact & Efficient URLs** — transform long URLs into short, shareable forms  
- 📈 **Scalable by Design** — automatically handles traffic spikes without manual intervention  
- 🔐 **Secure** — environment secrets and AWS IAM best practices  
- 📊 **Monitored** — logs and metrics through AWS CloudWatch  

---

## 🏗️ Why Serverless & AWS Lambda?

- **Auto-scaling**: AWS Lambda automatically scales the number of function instances based on traffic — Shrnk can handle sudden spikes in requests without downtime.  
- **Pay-per-use**: You pay only for the compute time you use, making it cost-efficient.  
- **High Availability**: Lambda functions run in multiple Availability Zones, ensuring resiliency.  
- **No Server Management**: Focus on code and business logic; AWS handles infrastructure, scaling, and patching.  
- **Fast Deployment**: Integrates seamlessly with Serverless Framework for quick updates and CI/CD pipelines.

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-------------|
| Language | TypeScript |
| Framework | Express.js |
| Infrastructure | Serverless Framework |
| Cloud Provider | AWS |
| Core Services | Lambda, DynamoDB, S3, API Gateway, CloudWatch |

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/shrnk.git
cd shrnk
```

### 2️⃣ Install Dependencies
npm install

### 3️⃣ Environment Variables
Create a .env file in the project root:
DYNAMO_TABLE_NAME=shrnk-data
JWT_SECRET=your_secret_key
BASE_URL=https://your-domain.com

### 4️⃣ Local Development
Run locally using Serverless Offline:
npm run offline

### 5️⃣ Deploy to AWS
npm run deploy


## 📦 Scripts
CommandDescriptionnpm run buildCompile TypeScript into JavaScriptnpm run deployBuild and deploy via Serverless Frameworknpm run offlineRun the app locally with API Gateway + Lambda emulation


## 📜 License
This project is licensed under the ISC License.

## ✨ Author
Taufiq Hassan
Serverless & Cloud Developer ☁️
🔗 GitHub

---

💡 With this version:  
- **Scalability** of Lambda is highlighted.  
- **Serverless benefits** like cost-efficiency, high availability, and auto-scaling are explained.  
- Still **professional, creative, and GitHub-ready**.  

If you want, I can also make a **small ASCII or simple diagram showing Shrnk’s AWS architecture** — it makes the README more visually appealing and shows the flow from API Gateway → Lambda → DynamoDB → CloudWatch → S3.  

Do you want me to add that?
