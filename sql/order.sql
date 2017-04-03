BEGIN;

    DROP TABLE IF EXISTS orderform CASCADE;

    -- 訂單
    CREATE TABLE IF NOT EXISTS orderform (
        id INTEGER PRIMARY KEY DEFAULT nextval('seq_id') NOT NULL,
        title TEXT,
        object_id INTEGER references object(id) ON DELETE RESTRICT ON UPDATE CASCADE,
        custom_id INTEGER references company(id) ON DELETE RESTRICT ON UPDATE CASCADE,
        created_at timestamp(0) default (now()),
        updated_at timestamp(0) default (now()),
        deleted_at timestamp(0) default (now())
    );

COMMIT;