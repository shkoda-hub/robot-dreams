#!/usr/bin/env bash

echo "---- Init test data ----"
npx ts-node init.ts
echo "---- Test data was initialized successfully ----"
echo

for MODE in RC RU; do
  echo "---- Demo in ${MODE} mode ----"

  npx ts-node writer.ts &
  WRITER_PID=$!
  sleep 1

  READ_MODE=$MODE npx ts-node reader.ts

  wait $WRITER_PID

  echo "---- Finished ${MODE} demo ----"
  echo
done
