BEGIN;

    SET TIMEZONE TO 'ROC';
    SET CLIENT_ENCODING TO 'UTF8';

    DROP TABLE IF EXISTS company CASCADE;
    DROP TABLE IF EXISTS company_phones CASCADE;
    DROP TABLE IF EXISTS object_category CASCADE;
    DROP TABLE IF EXISTS object CASCADE;
    DROP TABLE IF EXISTS object_spec CASCADE;
    DROP TABLE IF EXISTS object_material CASCADE;
    DROP TABLE IF EXISTS object_spec_provider CASCADE;
    DROP TABLE IF EXISTS tools CASCADE;

    --
    -- SEQUENCE id
    --
    CREATE SEQUENCE IF NOT EXISTS seq_id
        START WITH 1000000
        INCREMENT BY 1
        MINVALUE 1000000
        NO MAXVALUE
        CACHE 1;

    --
    -- SEQUENCE ranking
    --
    CREATE SEQUENCE IF NOT EXISTS seq_ranking
        START WITH 1
        INCREMENT BY 1
        MINVALUE 1
        NO MAXVALUE
        CACHE 1;

    --
    -- reset seq_id, seq_ranking
    --
    ALTER SEQUENCE seq_id RESTART WITH 1000000;
    ALTER SEQUENCE seq_ranking RESTART WITH 1;

    -- 廠商
    CREATE TABLE IF NOT EXISTS company (
        id INTEGER PRIMARY KEY DEFAULT nextval('seq_id') NOT NULL,
        title TEXT,
        address TEXT,
        email TEXT,
        summary TEXT,
        contacter TEXT,
        created_at timestamp(0) default (now()),
        updated_at timestamp(0) default (now())
    );

    -- 廠商電話
    CREATE TABLE IF NOT EXISTS company_phones (
        id INTEGER PRIMARY KEY DEFAULT nextval('seq_id') NOT NULL,
        company_id INTEGER references company(id) ON DELETE CASCADE ON UPDATE CASCADE,
        phone TEXT
    );

    -- 物件分類
    CREATE TABLE IF NOT EXISTS object_category (
        id INTEGER PRIMARY KEY DEFAULT nextval('seq_id') NOT NULL,
        title TEXT
    );

    -- 物件
    CREATE TABLE IF NOT EXISTS object (
        id INTEGER PRIMARY KEY DEFAULT nextval('seq_id') NOT NULL,
        category_id INTEGER references object_category(id) ON DELETE CASCADE,
        totalAmount INTEGER,
        created_at timestamp(0) default (now()),
        updated_at timestamp(0) default (now()),
        deleted_at timestamp(0) default (now())
    );

    -- 物件規格
    CREATE TABLE IF NOT EXISTS object_spec (
        id INTEGER PRIMARY KEY DEFAULT nextval('seq_id') NOT NULL,
        object_id INTEGER references object(id) ON DELETE CASCADE,
        title TEXT,
        amount INTEGER,
        document_id INTEGER,
        created_at timestamp(0) default (now()),
        updated_at timestamp(0) default (now())
    );
    
    -- 物件規格供應商 --
    CREATE TABLE IF NOT EXISTS object_spec_provider (
        id INTEGER PRIMARY KEY DEFAULT nextval('seq_id') NOT NULL,
        spec_id INTEGER references object_spec(id) ON DELETE CASCADE ON UPDATE CASCADE,
        company_id INTEGER references company(id) ON DELETE CASCADE ON UPDATE CASCADE,
        notice TEXT
    );

    -- 物件組成材料
    CREATE TABLE IF NOT EXISTS object_material (
        id INTEGER PRIMARY KEY DEFAULT nextval('seq_id') NOT NULL,
        object_id INTEGER references object(id) ON DELETE CASCADE,
        spec_id INTEGER references object_spec(id) ON DELETE CASCADE,
        company_id INTEGER references company(id) ON DELETE CASCADE ON UPDATE CASCADE, -- 這個材料的供應商是誰
        notice TEXT,
        image TEXT,
        created_at timestamp(0) default (now()),
        updated_at timestamp(0) default (now())
    );


    -- 工具
    CREATE TABLE IF NOT EXISTS tools (
        id INTEGER PRIMARY KEY DEFAULT nextval('seq_id') NOT NULL,
        name TEXT,
        image TEXT,
        summary TEXT,
        document_id INTEGER,
        created_at timestamp(0) default (now()),
        updated_at timestamp(0) default (now())
    );

COMMIT;