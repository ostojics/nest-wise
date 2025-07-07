.PHONY: dev stop

dev:
	@echo "Starting Docker services in detached mode..."
	docker compose up -d
	@echo "Starting development servers..."
	pnpm dev

stop:
	@echo "Stopping Docker services..."
	docker compose down 