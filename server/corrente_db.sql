CREATE DATABASE  IF NOT EXISTS `corrente_db`;
USE `corrente_db`;

DROP TABLE IF EXISTS `medicao`;

CREATE TABLE `medicao` (
  `idMedicao` int unsigned NOT NULL AUTO_INCREMENT,
  `corrente` float NOT NULL,
  `horario` datetime NOT NULL,
  PRIMARY KEY (`idMedicao`)
);