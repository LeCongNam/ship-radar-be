#!/bin/bash
set -e

# Thêm quyền Replication vào pg_hba.conf
echo "host replication all all trust" >> "$PGDATA/pg_hba.conf"