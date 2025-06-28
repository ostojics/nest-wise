# Solution Document

This document outlines the components of the system and their role.

All backend services will be developed with NestJS, while the Developer portal will be developed using React. TypeScript will be the language behind all services.

Services are logically separated to allow for better isolation and performance.

Game clients are games that will have the SDK installed in them. In the initial phase, this will be Unity and Unreal Engine clients.

All services and apps will be developed in a shared monorepo which will allow to efficiently share implementaions such as contracts, validations, etc...

## Core Service

Core service will store all relational data and handle user, studios, and games management. Core service is not limited to this data and might be extended in the future.

It allows the multi-tenant architecture of the system by utilizing a schema per tenant design through PostgreSQL.

## Developer Platform

Web platform for game developers allows them to create and manage their studios and games. It will serve all the data collected about users' games and allow them to register their game clients.

## Developer Platform BFF

Backend for frontend server specifically made to serve the developer portal. It will handle user authentication as well as any request sent by the developer portal.

As an **aggregator**, the BFF is responsible for fetching data from multiple downstream services (like Core Service and Metrics Service) and combining it into a single, convenient response for the Developer Platform. The web app should never talk to the core service directly.

## Event Ingestion Service

This service will handle collecting all metrics and events sent by game clients. It validates authorization data with the core service and delegates received metrics and events to the Kafka event queue.

Game client authorization is handled via an API Key sent in an `X-API-Key` header.

In its initial implementation, this service will reject incoming events if a dependency (like the Core Service) is unavailable. Future iterations may include request buffering.

## Event Queue (Kafka)

Kafka queue will work in pub/sub mode, publishing received events to all consumers.

To improve resilience, a **Dead-Letter Queue (DLQ)** strategy will be implemented. This will isolate malformed or unprocessable events to prevent them from halting consumer services.

## Alerting Service

Consumes all events through Kafka and keeps an internal count with Redis for all games. For persistence and durability, Redis will be configured to use the **Append Only File (AOF)** strategy.

When there is an amount of data relevant for an alert (e.g., 100 players reached), it notifies the user through email.

## Metrics Service

Stores collected time-series data in InfluxDB. It is responsible for storage of metrics and event data as well as responding to queries for that data from the BFF.

## Cross-Cutting Concerns

### Authentication & Authorization

- **Developers:** Authentication will be handled via Google (OAuth2). The Developer Platform will acquire a token and pass it to the BFF. The BFF will then validate the user's session with the Core Service for all authenticated requests.
- **Game Clients:** Game clients are authorized using a static API key generated and stored in the Core Service. This key must be included in all requests to the Event Ingestion Service.

### Inter-Service Communication

Services will primarily communicate via synchronous **RESTful APIs**. To ensure clear contracts and velocity, each NestJS service will use the built-in Swagger module to automatically generate an **OpenAPI 3.0 specification** from the shared DTOs and controller definitions. This provides live documentation and a foundation for generating typed clients.
