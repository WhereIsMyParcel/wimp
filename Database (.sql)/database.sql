/*
SQLyog Community v12.2.4 (64 bit)
MySQL - 10.1.13-MariaDB : Database - wimp
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`wimp` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `wimp`;

/*Table structure for table `courier` */

DROP TABLE IF EXISTS `courier`;

CREATE TABLE `courier` (
  `idCourier` int(15) NOT NULL AUTO_INCREMENT,
  `courier` varchar(100) NOT NULL,
  PRIMARY KEY (`idCourier`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

/*Data for the table `courier` */

insert  into `courier`(`idCourier`,`courier`) values 
(1,'Artoni'),
(2,'BRT'),
(3,'DHL'),
(4,'DPD'),
(5,'FedEx'),
(6,'GLS'),
(7,'Nexive'),
(8,'Poste Italiane'),
(9,'SDA'),
(10,'TNT'),
(11,'UPS');

/*Table structure for table `parcel` */

DROP TABLE IF EXISTS `parcel`;

CREATE TABLE `parcel` (
  `idParcel` int(15) NOT NULL AUTO_INCREMENT,
  `trackingCode` varchar(100) NOT NULL,
  `shippingDate` date DEFAULT NULL,
  `shippingHour` time DEFAULT NULL,
  `weight` float DEFAULT NULL,
  `ks_Sender` int(15) NOT NULL,
  `ks_Recipient` int(15) NOT NULL,
  `ks_Courier` int(15) NOT NULL,
  PRIMARY KEY (`idParcel`),
  UNIQUE KEY `codice_spedizione_UNIQUE` (`trackingCode`),
  KEY `fk_Spedizioni_Mittenti_idx` (`ks_Sender`),
  KEY `fk_Spedizioni_Destinatari1_idx` (`ks_Recipient`),
  KEY `fk_Spedizioni_Corrieri1_idx` (`ks_Courier`),
  CONSTRAINT `fk_Spedizioni_Corrieri1` FOREIGN KEY (`ks_Courier`) REFERENCES `courier` (`idCourier`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Spedizioni_Destinatari1` FOREIGN KEY (`ks_Recipient`) REFERENCES `recipient` (`idRecipient`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Spedizioni_Mittenti` FOREIGN KEY (`ks_Sender`) REFERENCES `sender` (`idSender`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `parcel` */

insert  into `parcel`(`idParcel`,`trackingCode`,`shippingDate`,`shippingHour`,`weight`,`ks_Sender`,`ks_Recipient`,`ks_Courier`) values 
(1,'9955V1815498F','2016-08-20','15:32:21',4.7,1,2,3),
(2,'M1012218683','2016-08-24','17:53:45',1.4,2,1,2),
(3,'GHG72F94JX4','2016-06-01',NULL,2.54,3,3,5);

/*Table structure for table `path` */

DROP TABLE IF EXISTS `path`;

CREATE TABLE `path` (
  `idPath` int(15) NOT NULL AUTO_INCREMENT,
  `ks_Parcel` int(15) NOT NULL,
  `date` date DEFAULT NULL,
  `hour` time DEFAULT NULL,
  `place` varchar(100) NOT NULL,
  `note` varchar(100) DEFAULT NULL,
  `dateTimeOnUpdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idPath`),
  KEY `fk_tracciati_spedizioni1_idx` (`ks_Parcel`),
  CONSTRAINT `fk_tracciati_spedizioni1` FOREIGN KEY (`ks_Parcel`) REFERENCES `parcel` (`idParcel`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8;

/*Data for the table `path` */

insert  into `path`(`idPath`,`ks_Parcel`,`date`,`hour`,`place`,`note`,`dateTimeOnUpdate`) values 
(62,1,'2016-08-20','15:00:18','London','Taking charge','2016-08-29 17:08:38'),
(63,1,'2016-08-21','12:32:51','Bruxelles','In transit','2016-08-29 17:08:46'),
(64,1,'2016-08-22','04:08:12','Milano','In transit','2016-08-29 17:09:07'),
(65,1,'2016-08-23','16:45:08','Roma','In transit','2016-08-29 17:09:50'),
(68,1,'2016-08-24','22:00:01','Cagliari','Delivering','2016-08-29 17:49:47'),
(69,2,'2016-08-25','10:00:01','Milano','Taking charge','2016-08-29 17:50:17'),
(70,2,'2016-08-26',NULL,'Orio','In transit','2016-08-29 17:50:52'),
(71,2,'2016-08-26',NULL,'Rabat','In transit','2016-08-29 17:50:57'),
(73,2,'2016-08-27',NULL,'Pretoria','In transit','2016-08-29 17:51:29'),
(74,2,'2016-08-28','05:43:12','Citta del Capo','Delivering','2016-08-29 17:51:37'),
(77,3,'2016-06-01','10:45:23','Trento','Taking charge','2016-08-29 18:04:49'),
(78,3,'2016-06-02',NULL,'Verona','In transit','2016-08-29 18:04:50'),
(79,3,'2016-06-03',NULL,'Gubbio','In transit','2016-08-29 18:04:53'),
(80,3,'2016-06-03','09:05:03','Roma','In transit','2016-08-29 18:09:57'),
(81,3,'2016-06-04',NULL,'Napoli','In transit','2016-08-29 18:10:58'),
(82,3,'2016-06-05','03:23:59','Cirò','Delivering','2016-08-29 18:10:59');

/*Table structure for table `recipient` */

DROP TABLE IF EXISTS `recipient`;

CREATE TABLE `recipient` (
  `idRecipient` int(15) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `surname` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  `postCode` decimal(20,0) NOT NULL,
  `region` varchar(100) DEFAULT NULL,
  `landline` varchar(20) DEFAULT NULL,
  `mobilePhone` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`idRecipient`),
  UNIQUE KEY `idDestinatario_UNIQUE` (`idRecipient`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `recipient` */

insert  into `recipient`(`idRecipient`,`name`,`surname`,`address`,`city`,`postCode`,`region`,`landline`,`mobilePhone`,`email`) values 
(1,'Miraxh','Tereziu','Killarney Gardens 11 ','Citta del capo','20122','Citta del capo','0461852877','2147483647','miraxh.tereziu@gmail.com'),
(2,'Andrea','Calzetta','Via della Madonnina','Sassari','7100','Trento','0461846937','2147483647','andrea.calzetta@alice.it'),
(3,'Gianvittorio','Dal Prà','Via Aldo Barbaro 5','Catanzaro','88100','Catanzaro','0562164921','3289564821','gianvittorio.dalpra@tiscali.com');

/*Table structure for table `sender` */

DROP TABLE IF EXISTS `sender`;

CREATE TABLE `sender` (
  `idSender` int(15) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `surname` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  `postCode` decimal(20,0) NOT NULL,
  `region` varchar(100) DEFAULT NULL,
  `landline` varchar(20) DEFAULT NULL,
  `mobilePhone` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`idSender`),
  UNIQUE KEY `idMittente_UNIQUE` (`idSender`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `sender` */

insert  into `sender`(`idSender`,`name`,`surname`,`address`,`city`,`postCode`,`region`,`landline`,`mobilePhone`,`email`) values 
(1,'Carlo','Corradini','Chelsea SW3 2TJ','London','38070','London','0464855287','2147483647','carlo.corradini@gmail.com'),
(2,'Luca','Santoro','Via Paolo da Cannobio 8','Milano','20122','Milano','0464694621','2147483647','luca.santoro@hotmail.it'),
(3,'Michela','Pezzato','Via della Prepositura 6','Trento','38122','Trento','0562859276','3286763654','michela.pezzato@hotmail.it');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
