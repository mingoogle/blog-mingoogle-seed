## Description

Kafka Integration Project Based on [NestJS Documentation](https://docs.nestjs.com/microservices/kafka) - Part 4

[In this blog post](https://mingoogle.tistory.com/), we will explore how to integrate Kafka with NestJS.

## Installation

```bash
$ yarn install
```

## 사전 작업
1. 카프카 서버 실행 및 카프카 토픽 생성
```bash
$ cd {path}/blog-mingoogle-seed/docker
$ docker-compose up -d --build zookeeper
$ docker-compose up -d --build kafka
```
2. 카프카 마이그레이션 - Kafka Migrate
    - 사전에 카프카 서버가 실행되어야합니다.
```bash
$ cd {path}/blog-mingoogle-seed/server
$ yarn migrate:kafka-topics local up
```

## Running the app

1. 로컬에서 실행 (Run locally)
```bash
$ cd {path}/blog-mingoogle-seed/server
$ yarn start:main
$ yarn start:auth
```

2. 도커 환경에서 실행 (Run in Docker environment)
```bash
$ cd {path}/blog-mingoogle-seed/docker
$ docker-compose up -d --build
```

## Stay in touch
- Author - [mingoogle](https://github.com/mingoogle)

## License
Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

Nest is [MIT licensed](LICENSE).
