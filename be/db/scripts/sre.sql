-- MySQL Script generated by MySQL Workbench
-- Thu Oct 25 22:59:00 2018
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema sre
-- -----------------------------------------------------
-- Database schema for the Smart Reporting Enabler

-- -----------------------------------------------------
-- Schema sre
--
-- Database schema for the Smart Reporting Enabler
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `sre` DEFAULT CHARACTER SET utf8 ;
USE `sre` ;

-- -----------------------------------------------------
-- Table `sre`.`templates`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sre`.`templates`;
CREATE TABLE IF NOT EXISTS `sre`.`templates` (
  `idtemplates` INT NOT NULL AUTO_INCREMENT,
  `owner` VARCHAR(45) NULL COMMENT 'Template owner',
  `createdat` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Template creation timestamp',
  `updateat` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'Template updated timestamp',
  `name` VARCHAR(45) NULL COMMENT 'Template’s name',
  PRIMARY KEY (`idtemplates`),
  UNIQUE INDEX `idtemplates_UNIQUE` (`idtemplates` ASC))
ENGINE = InnoDB
COMMENT = 'Table to store all the report templates for each user - in this case we use the word template owner';


-- -----------------------------------------------------
-- Table `sre`.`connections`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sre`.`connections`;
CREATE TABLE IF NOT EXISTS `sre`.`connections` (
  `idconnections` INT NOT NULL AUTO_INCREMENT,
  `hostname` VARCHAR(45) NULL,
  `port` INT NULL,
  `username` VARCHAR(45) NULL,
  `password` VARCHAR(45) NULL,
  `createdat` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedat` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `tablename` VARCHAR(45) NULL,
  `templates_idtemplates` INT NOT NULL,
  `dbname` VARCHAR(45) NULL,
  PRIMARY KEY (`idconnections`),
  UNIQUE INDEX `idconnections_UNIQUE` (`idconnections` ASC),
  INDEX `fk_connections_templates1_idx` (`templates_idtemplates` ASC),
  CONSTRAINT `fk_connections_templates1`
    FOREIGN KEY (`templates_idtemplates`)
    REFERENCES `sre`.`templates` (`idtemplates`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'Table to store the mysql connections for each report template';


-- -----------------------------------------------------
-- Table `sre`.`headers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sre`.`headers`;
CREATE TABLE IF NOT EXISTS `sre`.`headers` (
  `idheaders` INT NOT NULL AUTO_INCREMENT,
  `html` LONGTEXT NULL,
  `createdat` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedat` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `templates_idtemplates` INT NOT NULL,
  PRIMARY KEY (`idheaders`),
  UNIQUE INDEX `idheaders_UNIQUE` (`idheaders` ASC),
  INDEX `fk_headers_templates1_idx` (`templates_idtemplates` ASC),
  CONSTRAINT `fk_headers_templates1`
    FOREIGN KEY (`templates_idtemplates`)
    REFERENCES `sre`.`templates` (`idtemplates`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sre`.`body`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sre`.`body`;
CREATE TABLE IF NOT EXISTS `sre`.`body` (
  `idbody` INT NOT NULL AUTO_INCREMENT,
  `html` LONGTEXT NULL,
  `createdat` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedat` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `templates_idtemplates` INT NOT NULL,
  PRIMARY KEY (`idbody`),
  UNIQUE INDEX `idbody_UNIQUE` (`idbody` ASC),
  INDEX `fk_body_templates1_idx` (`templates_idtemplates` ASC),
  CONSTRAINT `fk_body_templates1`
    FOREIGN KEY (`templates_idtemplates`)
    REFERENCES `sre`.`templates` (`idtemplates`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sre`.`footers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sre`.`footers`;
CREATE TABLE IF NOT EXISTS `sre`.`footers` (
  `idfooters` INT NOT NULL AUTO_INCREMENT,
  `html` LONGTEXT NULL,
  `createdat` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedat` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `templates_idtemplates` INT NOT NULL,
  PRIMARY KEY (`idfooters`),
  UNIQUE INDEX `idfooters_UNIQUE` (`idfooters` ASC),
  INDEX `fk_footers_templates1_idx` (`templates_idtemplates` ASC),
  CONSTRAINT `fk_footers_templates1`
    FOREIGN KEY (`templates_idtemplates`)
    REFERENCES `sre`.`templates` (`idtemplates`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sre`.`common`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sre`.`common`;
CREATE TABLE IF NOT EXISTS `sre`.`common` (
  `idcommon` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NULL,
  `data` BLOB NULL,
  `createdat` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedat` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `name` VARCHAR(45) NULL,
  `templates_idtemplates` INT NOT NULL,
  PRIMARY KEY (`idcommon`),
  UNIQUE INDEX `idcommon_UNIQUE` (`idcommon` ASC),
  INDEX `fk_common_templates1_idx` (`templates_idtemplates` ASC),
  CONSTRAINT `fk_common_templates1`
    FOREIGN KEY (`templates_idtemplates`)
    REFERENCES `sre`.`templates` (`idtemplates`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sre`.`tables`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sre`.`tables`;
CREATE TABLE IF NOT EXISTS `sre`.`tables` (
  `idtables` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `templates_idtemplates` INT NOT NULL,
  PRIMARY KEY (`idtables`),
  INDEX `fk_tables_templates1_idx` (`templates_idtemplates` ASC),
  CONSTRAINT `fk_tables_templates1`
    FOREIGN KEY (`templates_idtemplates`)
    REFERENCES `sre`.`templates` (`idtemplates`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sre`.`fields`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sre`.`fields`;
CREATE TABLE IF NOT EXISTS `sre`.`fields` (
  `idfields` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `aliases` VARCHAR(45) NULL,
  `tables_idtables` INT NOT NULL,
  PRIMARY KEY (`idfields`),
  INDEX `fk_fields_tables1_idx` (`tables_idtables` ASC),
  CONSTRAINT `fk_fields_tables1`
    FOREIGN KEY (`tables_idtables`)
    REFERENCES `sre`.`tables` (`idtables`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sre`.`filters`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sre`.`filters`;
CREATE TABLE IF NOT EXISTS `sre`.`filters` (
  `idfilters` INT NOT NULL AUTO_INCREMENT,
  `cond` VARCHAR(45) NOT NULL,
  `value` VARCHAR(45) NOT NULL,
  `fields_idfields` INT NOT NULL,
  PRIMARY KEY (`idfilters`),
  INDEX `fk_filters_fields1_idx` (`fields_idfields` ASC),
  CONSTRAINT `fk_filters_fields1`
    FOREIGN KEY (`fields_idfields`)
    REFERENCES `sre`.`fields` (`idfields`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sre`.`groupby`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sre`.`groupby`;
CREATE TABLE IF NOT EXISTS `sre`.`groupby` (
  `idgroupby` INT NOT NULL AUTO_INCREMENT,
  `table` VARCHAR(45) NULL,
  `field` VARCHAR(45) NULL,
  `templates_idtemplates` INT NOT NULL,
  PRIMARY KEY (`idgroupby`),
  INDEX `fk_groupby_templates1_idx` (`templates_idtemplates` ASC),
  CONSTRAINT `fk_groupby_templates1`
    FOREIGN KEY (`templates_idtemplates`)
    REFERENCES `sre`.`templates` (`idtemplates`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sre`.`relations`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `sre`.`relations`;
CREATE TABLE IF NOT EXISTS `sre`.`relations` (
  `idrelations` INT NOT NULL AUTO_INCREMENT,
  `lefttable` VARCHAR(45) NULL,
  `leftfield` VARCHAR(45) NULL,
  `righttable` VARCHAR(45) NULL,
  `rightfield` VARCHAR(45) NULL,
  `templates_idtemplates` INT NOT NULL,
  PRIMARY KEY (`idrelations`),
  INDEX `fk_relations_templates1_idx` (`templates_idtemplates` ASC),
  CONSTRAINT `fk_relations_templates1`
    FOREIGN KEY (`templates_idtemplates`)
    REFERENCES `sre`.`templates` (`idtemplates`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

/*CREATE USER 'sreuser' IDENTIFIED BY 'srepassword';

GRANT ALL ON `sre`.* TO 'sreuser';
GRANT EXECUTE ON ROUTINE `sre`.* TO 'sreuser';
GRANT SELECT, INSERT, TRIGGER, UPDATE, DELETE ON TABLE `sre`.* TO 'sreuser';
GRANT SELECT, INSERT, TRIGGER ON TABLE `sre`.* TO 'sreuser';
GRANT SELECT ON TABLE `sre`.* TO 'sreuser';*/

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
