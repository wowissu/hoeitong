BEGIN;

    SET TIMEZONE TO 'ROC';
    SET CLIENT_ENCODING TO 'UTF8';

    DROP TABLE IF EXISTS company CASCADE;
    DROP TABLE IF EXISTS company_phones CASCADE;
    DROP TABLE IF EXISTS tabs CASCADE;
    DROP TABLE IF EXISTS tab_ship CASCADE;
    DROP TABLE IF EXISTS manual CASCADE;
    DROP TABLE IF EXISTS object CASCADE;
    DROP TABLE IF EXISTS object_images CASCADE;
    DROP TABLE IF EXISTS object_provider CASCADE;
    -- DROP TABLE IF EXISTS object_category CASCADE;
    -- DROP TABLE IF EXISTS object_spec CASCADE;
    -- DROP TABLE IF EXISTS object_material CASCADE;
    -- DROP TABLE IF EXISTS object_spec_provider CASCADE;
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


    -- 使用手冊
    CREATE TABLE IF NOT EXISTS manual
    (
        id INTEGER PRIMARY KEY DEFAULT nextval('seq_id') NOT NULL,
        content TEXT,
        created_at timestamp(0) default (now()),
        updated_at timestamp(0) default (now())
    );

    -- 廠商
    CREATE TABLE IF NOT EXISTS company
    (
        id INTEGER PRIMARY KEY DEFAULT nextval('seq_id') NOT NULL,
        title TEXT,
        address TEXT,
        email TEXT,
        summary TEXT,
        owner TEXT,
        created_at timestamp(0) default (now()),
        updated_at timestamp(0) default (now())
    );

    -- 廠商電話
    CREATE TABLE IF NOT EXISTS company_phones
    (
        id INTEGER PRIMARY KEY DEFAULT nextval('seq_id') NOT NULL,
        type SMALLINT DEFAULT 0 NOT NULL, -- 0: 市話, 1: 傳真
        company_id INTEGER references company(id) ON DELETE CASCADE ON UPDATE CASCADE,
        contactor TEXT,
        phone TEXT,
        ranking integer
    );

    -- 工具
    CREATE TABLE IF NOT EXISTS tools
    (
        id INTEGER PRIMARY KEY DEFAULT nextval('seq_id') NOT NULL,
        name TEXT,
        image TEXT,
        summary TEXT,
        document_id INTEGER,
        created_at timestamp(0) default (now()),
        updated_at timestamp(0) default (now())
    );

    -- 標籤
    CREATE TABLE IF NOT EXISTS tabs
    (
        id INTEGER PRIMARY KEY DEFAULT nextval('seq_id') NOT NULL,
        title TEXT
    );

    -- 標籤與關係id
    CREATE TABLE IF NOT EXISTS tab_ship
    (
        id INTEGER PRIMARY KEY DEFAULT nextval('seq_id') NOT NULL,
        tab_id INTEGER references tabs(id) ON DELETE CASCADE ON UPDATE CASCADE,
        relate_id INTEGER
    );

    -- 物件
    CREATE TABLE IF NOT EXISTS object
    (
        id INTEGER PRIMARY KEY DEFAULT nextval('seq_id') NOT NULL,
        type SMALLINT, -- 1:原料 2:成品 3:部位 4:規格
        relate_id INTEGER references object(id) ON DELETE CASCADE ON UPDATE CASCADE, --
        parent_id INTEGER references object(id) ON DELETE CASCADE ON UPDATE CASCADE, --
        manual_id INTEGER references manual(id) ON DELETE NO ACTION ON UPDATE CASCADE, -- 文件
        title TEXT,
        model TEXT,
        summary TEXT,
        spec TEXT,
        amount INTEGER, -- 3: 數量
        created_at timestamp(0) default (now()),
        updated_at timestamp(0) default (now()),
        deleted_at timestamp(0)
    );

    -- 圖片
    CREATE TABLE IF NOT EXISTS object_images
    (
        id INTEGER PRIMARY KEY DEFAULT nextval('seq_id') NOT NULL,
        object_id INTEGER references object(id) ON DELETE CASCADE ON UPDATE CASCADE, --
        image TEXT
    );

    -- 物件供應商 --
    CREATE TABLE IF NOT EXISTS object_provider
    (
        -- id INTEGER PRIMARY KEY DEFAULT nextval('seq_id') NOT NULL,
        object_id INTEGER NOT NULL references object(id) ON DELETE CASCADE ON UPDATE CASCADE,
        company_id INTEGER NOT NULL references company(id) ON DELETE CASCADE ON UPDATE CASCADE,
        notice TEXT, -- 備註
        created_at timestamp(0) default (now()),
        updated_at timestamp(0) default (now()),
        PRIMARY KEY (object_id, company_id)
    );


COMMIT;