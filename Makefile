install: init

.PHONY: test

init:
	docker-compose up -d
	docker-compose run --rm node yarn install --no-save

test:
	docker-compose run --rm node npm run test
