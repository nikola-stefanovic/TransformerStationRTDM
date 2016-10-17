CREATE TABLE TS_USER
( id int PRIMARY KEY ,
  name VARCHAR2(32) UNIQUE,
  password VARCHAR2(32),
  role VARCHAR2(16) CHECK( role IN ('director','operator'))
);
INSERT INTO ts_user(NAME,PASSWORD,ROLE) VALUES('director','director','director');
CREATE SEQUENCE ts_user_id_seq START WITH 1;
CREATE OR REPLACE TRIGGER ts_user_id_tr
BEFORE INSERT ON ts_user
FOR EACH ROW
BEGIN
  SELECT ts_user_id_seq.NEXTVAL
  INTO   :new.id
  FROM   dual;
END;



CREATE TABLE TRANSFORMER_STATION
( id INT,
  address VARCHAR2(128),
  description VARCHAR2(1024),
  monitoring NUMBER(1) DEFAULT 0,
  PRIMARY KEY (id)
);
CREATE SEQUENCE transformer_id_seq START WITH 1;
CREATE OR REPLACE TRIGGER transformer_id_tr
BEFORE INSERT ON transformer_station
FOR EACH ROW
BEGIN
  SELECT transformer_id_seq.NEXTVAL
  INTO   :new.id
  FROM   dual;
END;


CREATE TABLE OPERATE
( id INTEGER,
  operator_id INT,
  transformer_id INT,
  CONSTRAINT fk_operator FOREIGN KEY(operator_id) REFERENCES ts_user(id) ON DELETE CASCADE,
  CONSTRAINT fk_transformer FOREIGN KEY(transformer_id) REFERENCES transformer_station(id) ON DELETE CASCADE,
  CONSTRAINT pk_operate PRIMARY KEY (id)
);
CREATE SEQUENCE operate_id_seq START WITH 1;
CREATE OR REPLACE TRIGGER operate_id_tr
BEFORE INSERT ON OPERATE
FOR EACH ROW
BEGIN
  SELECT operate_id_seq.NEXTVAL
  INTO   :new.id
  FROM   dual;
END;
