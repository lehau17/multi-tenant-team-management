COMPOSE_DEV = docker compose -f docker-compose.dev.yml
COMPOSE_PROD = docker compose -f docker-compose.prod.yml
COMMAND_DEV = npm run start:dev:

infra-dev-up:
	$(COMPOSE_DEV) up -d
infra-dev-down:
	$(COMPOSE_DEV) down
main-dev:
	$(COMMAND_DEV)main-api

