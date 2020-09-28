#! /bin/sh
set -e

echo "=== Seeding with Initial Data ==="
psql -U postgres -d "local" -b --single-transaction -a -f $1;

echo "=== Complete ==="