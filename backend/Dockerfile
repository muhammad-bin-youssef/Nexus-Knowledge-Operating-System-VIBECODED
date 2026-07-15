FROM rust:latest AS builder

WORKDIR /usr/src/kos-backend

COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /usr/src/kos-backend/target/release/kos-backend ./kos-backend

ENV KOS_PORT=3001
ENV KOS_BIND_ADDR=0.0.0.0
ENV KOS_DATA_DIR=/data

EXPOSE 3001

CMD ["./kos-backend"]
