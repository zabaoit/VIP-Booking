-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th5 22, 2026 lúc 07:46 AM
-- Phiên bản máy phục vụ: 8.4.7
-- Phiên bản PHP: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
--
CREATE DATABASE IF NOT EXISTS `vipbooking` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `vipbooking`;

-- --------------------------------------------------------

--
--

DROP TABLE IF EXISTS `booking`;
CREATE TABLE IF NOT EXISTS `booking` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `booking_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `check_in_date` date NOT NULL,
  `check_out_date` date NOT NULL,
  `guest_count` int NOT NULL,
  `special_request` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `booking_fk1` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
--

INSERT INTO `booking` (`id`, `user_id`, `booking_date`, `check_in_date`, `check_out_date`, `guest_count`, `special_request`, `created_at`, `updated_at`) VALUES
(1, 4, '2026-05-22 14:30:09', '2026-06-01', '2026-06-03', 1, 'Yêu cầu phòng không hút thuốc', '2026-05-22 14:30:09', '2026-05-22 14:30:09'),
(2, 5, '2026-05-22 14:30:09', '2026-06-05', '2026-06-08', 2, 'Check-in muộn lúc 20h', '2026-05-22 14:30:09', '2026-05-22 14:30:09'),
(3, 6, '2026-05-22 14:30:09', '2026-06-10', '2026-06-12', 4, 'Cần thêm 1 nôi em bé', '2026-05-22 14:30:09', '2026-05-22 14:30:09'),
(4, 4, '2026-05-22 14:30:09', '2026-06-15', '2026-06-16', 2, 'Phòng tầng cao view đẹp', '2026-05-22 14:30:09', '2026-05-22 14:30:09'),
(5, 5, '2026-05-22 14:30:09', '2026-06-20', '2026-06-22', 2, 'Không có yêu cầu đặc biệt', '2026-05-22 14:30:09', '2026-05-22 14:30:09');

-- --------------------------------------------------------

--
--

DROP TABLE IF EXISTS `bookingdetail`;
CREATE TABLE IF NOT EXISTS `bookingdetail` (
  `booking_detail_id` bigint NOT NULL AUTO_INCREMENT,
  `booking_id` bigint NOT NULL,
  `room_id` bigint NOT NULL,
  `price_per_night` decimal(12,2) NOT NULL,
  `number_of_nights` int NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`booking_detail_id`),
  KEY `bookingdetail_fk1` (`booking_id`),
  KEY `bookingdetail_fk2` (`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
--

INSERT INTO `bookingdetail` (`booking_detail_id`, `booking_id`, `room_id`, `price_per_night`, `number_of_nights`, `subtotal`, `note`) VALUES
(1, 1, 1, 450000.00, 2, 900000.00, 'Khách lẻ ở phòng 101'),
(2, 2, 3, 900000.00, 3, 2700000.00, 'Cặp đôi ở phòng Deluxe 201'),
(3, 3, 6, 2200000.00, 2, 4400000.00, 'Gia đình ở phòng Family 302'),
(4, 4, 2, 650000.00, 1, 650000.00, 'Ở ngắn ngày phòng 102'),
(5, 5, 5, 1500000.00, 2, 3000000.00, 'Phòng King Suite 301');

-- --------------------------------------------------------

--
--

DROP TABLE IF EXISTS `checkinout`;
CREATE TABLE IF NOT EXISTS `checkinout` (
  `check_in_out_id` bigint NOT NULL AUTO_INCREMENT,
  `booking_id` bigint NOT NULL,
  `room_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `check_in_time` datetime NOT NULL,
  `check_out_time` datetime NOT NULL,
  `note` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`check_in_out_id`),
  KEY `checkinout_fk1` (`booking_id`),
  KEY `checkinout_fk2` (`room_id`),
  KEY `checkinout_fk3` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
--

INSERT INTO `checkinout` (`check_in_out_id`, `booking_id`, `room_id`, `user_id`, `check_in_time`, `check_out_time`, `note`) VALUES
(1, 1, 1, 3, '2026-06-01 14:00:00', '2026-06-03 12:00:00', 'Check-in/out đúng giờ'),
(2, 2, 3, 3, '2026-06-05 20:15:00', '2026-06-08 11:30:00', 'Khách check-in muộn như yêu cầu'),
(3, 3, 6, 3, '2026-06-10 13:45:00', '2026-06-12 12:00:00', 'Đã chuẩn bị nôi em bé đầy đủ'),
(4, 4, 2, 3, '2026-06-15 14:00:00', '2026-06-16 12:00:00', 'Khách đi công tác ngắn ngày'),
(5, 5, 5, 3, '2026-06-20 14:10:00', '2026-06-22 11:50:00', 'Phòng VIP chu đáo');

-- --------------------------------------------------------

--
--

DROP TABLE IF EXISTS `invoice`;
CREATE TABLE IF NOT EXISTS `invoice` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `booking_id` bigint NOT NULL,
  `invoice_code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `room_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `issued_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `service_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `surcharge_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `discount_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `tax_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoice_code` (`invoice_code`),
  KEY `invoice_fk1` (`booking_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
--

INSERT INTO `invoice` (`id`, `booking_id`, `invoice_code`, `room_amount`, `issued_date`, `service_amount`, `surcharge_amount`, `discount_amount`, `tax_amount`, `total_amount`, `note`, `updated_at`) VALUES
(1, 1, 'HD001', 900000.00, '2026-05-22 14:30:09', 60000.00, 0.00, 0.00, 96000.00, 1056000.00, 'Hóa đơn thanh toán phòng 101', '2026-05-22 14:30:09'),
(2, 2, 'HD002', 2700000.00, '2026-05-22 14:30:09', 480000.00, 0.00, 100000.00, 308000.00, 3388000.00, 'Giảm giá 100k cho khách quen', '2026-05-22 14:30:09'),
(3, 3, 'HD003', 4400000.00, '2026-05-22 14:30:09', 100000.00, 50000.00, 0.00, 455000.00, 5005000.00, 'Phụ thu 50k hư hỏng nhẹ', '2026-05-22 14:30:09'),
(4, 4, 'HD004', 650000.00, '2026-05-22 14:30:09', 0.00, 0.00, 0.00, 65000.00, 715000.00, 'Hóa đơn thanh toán phòng 102', '2026-05-22 14:30:09'),
(5, 5, 'HD005', 3000000.00, '2026-05-22 14:30:09', 700000.00, 0.00, 200000.00, 350000.00, 385000.00, 'Khách VIP ưu đãi giảm 200k', '2026-05-22 14:30:09');

-- --------------------------------------------------------

--
--

DROP TABLE IF EXISTS `invoicedetail`;
CREATE TABLE IF NOT EXISTS `invoicedetail` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `invoice_id` bigint NOT NULL,
  `reference_id` bigint NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `unit_price` decimal(12,2) NOT NULL DEFAULT '0.00',
  `amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `invoicedetail_fk1` (`invoice_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
--

INSERT INTO `invoicedetail` (`id`, `invoice_id`, `reference_id`, `description`, `quantity`, `unit_price`, `amount`) VALUES
(1, 1, 1, 'Tiền phòng 101 (2 đêm)', 1, 900000.00, 900000.00),
(2, 1, 5, 'Nước suối tủ lạnh (Mini-bar)', 3, 20000.00, 60000.00),
(3, 2, 3, 'Tiền phòng Deluxe 201 (3 đêm)', 1, 2700000.00, 2700000.00),
(4, 2, 2, 'Buffet Sáng Cao Cấp', 2, 150000.00, 300000.00),
(5, 2, 3, 'Thuê xe máy tự lái', 1, 180000.00, 180000.00);

-- --------------------------------------------------------

--
--

DROP TABLE IF EXISTS `payment`;
CREATE TABLE IF NOT EXISTS `payment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `invoice_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `paid_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `payment_fk1` (`invoice_id`),
  KEY `payment_fk2` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
--

INSERT INTO `payment` (`id`, `invoice_id`, `user_id`, `amount`, `paid_at`) VALUES
(1, 1, 4, 1056000.00, '2026-05-22 14:30:09'),
(2, 2, 5, 3388000.00, '2026-05-22 14:30:09'),
(3, 3, 6, 5005000.00, '2026-05-22 14:30:09'),
(4, 4, 4, 715000.00, '2026-05-22 14:30:09'),
(5, 5, 5, 3850000.00, '2026-05-22 14:30:09');

-- --------------------------------------------------------

--
--

DROP TABLE IF EXISTS `role`;
CREATE TABLE IF NOT EXISTS `role` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
--

INSERT INTO `role` (`id`, `role_name`, `description`) VALUES
(1, 'Admin', 'Quản trị viên hệ thống toàn quyền'),
(2, 'Manager', 'Quản lý khách sạn, điều hành nhân sự'),
(3, 'Receptionist', 'Lễ tân check-in, check-out và tạo hóa đơn'),
(4, 'Housekeeping', 'Nhân viên buồng phòng dọn dẹp'),
(5, 'Customer', 'Khách hàng đăng ký tài khoản');

-- --------------------------------------------------------

--
--

DROP TABLE IF EXISTS `room`;
CREATE TABLE IF NOT EXISTS `room` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `room_number` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `floor` int NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `room_number` (`room_number`),
  KEY `room_fk5` (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
--

INSERT INTO `room` (`id`, `room_number`, `floor`, `description`, `image_url`, `type_id`) VALUES
(1, '101', 1, 'Phòng đơn tầng trệt tiện lợi', 'url_room_101.jpg', 1),
(2, '102', 1, 'Phòng đôi tiêu chuẩn thoáng mát', 'url_room_102.jpg', 2),
(3, '201', 2, 'Phòng Deluxe sang trọng view vườn', 'url_room_201.jpg', 3),
(4, '202', 2, 'Phòng Deluxe yên tĩnh', 'url_room_202.jpg', 3),
(5, '301', 3, 'Phòng Suite tổng thống view trọn thành phố', 'url_room_301.jpg', 4),
(6, '302', 3, 'Phòng gia đình tiện nghi có ban công', 'url_room_302.jpg', 5);

-- --------------------------------------------------------

--
--

DROP TABLE IF EXISTS `roomtype`;
CREATE TABLE IF NOT EXISTS `roomtype` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(12,2) NOT NULL,
  `capacity` int NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
--

INSERT INTO `roomtype` (`id`, `name`, `price`, `capacity`, `description`) VALUES
(1, 'Standard Single', 450000.00, 1, 'Phòng đơn tiêu chuẩn, giường 1m2'),
(2, 'Standard Double', 650000.00, 2, 'Phòng đôi tiêu chuẩn, giường 1m6'),
(3, 'Deluxe Twin', 900000.00, 2, 'Phòng Deluxe 2 giường đơn hạng sang'),
(4, 'Suite King', 1500000.00, 2, 'Phòng Suite cao cấp, giường King size, view biển'),
(5, 'Family Suite', 2200000.00, 4, 'Phòng gia đình rộng rãi, 2 giường đôi lớn');

-- --------------------------------------------------------

--
--

DROP TABLE IF EXISTS `service`;
CREATE TABLE IF NOT EXISTS `service` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `service_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `unit` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
--

INSERT INTO `service` (`id`, `service_name`, `description`, `unit_price`, `unit`, `duration`, `created_at`, `updated_at`) VALUES
(1, 'Giặt là siêu tốc', 'Giặt, sấy và ủi quần áo lấy trong ngày', 50000.00, 'bộ', 12, '2026-05-22 14:30:09', '2026-05-22 14:30:09'),
(2, 'Buffet Sáng Cao Cấp', 'Buffet sáng tại nhà hàng tầng 4', 150000.00, 'người', 3, '2026-05-22 14:30:09', '2026-05-22 14:30:09'),
(3, 'Thuê xe máy tự lái', 'Xe tay ga đời mới kèm 2 mũ bảo hiểm', 180000.00, 'ngày', 24, '2026-05-22 14:30:09', '2026-05-22 14:30:09'),
(4, 'Massage Toàn Thân', 'Liệu trình thư giãn tại Spa khách sạn', 350000.00, 'suất', 1, '2026-05-22 14:30:09', '2026-05-22 14:30:09'),
(5, 'Nước suối tủ lạnh (Mini-bar)', 'Nước khoáng đặt sẵn tại tủ lạnh phòng', 20000.00, 'chai', 0, '2026-05-22 14:30:09', '2026-05-22 14:30:09');

-- --------------------------------------------------------

--
--

DROP TABLE IF EXISTS `serviceusage`;
CREATE TABLE IF NOT EXISTS `serviceusage` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `service_id` bigint NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `used_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `booking_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `serviceusage_fk1` (`service_id`),
  KEY `serviceusage_fk7` (`booking_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
--

INSERT INTO `serviceusage` (`id`, `service_id`, `quantity`, `unit_price`, `subtotal`, `note`, `used_at`, `booking_id`) VALUES
(1, 2, 2, 150000.00, 300000.00, 'Buffet sáng cho 2 người', '2026-05-22 14:30:09', 2),
(2, 5, 3, 20000.00, 60000.00, 'Khách uống 3 chai nước ngọt mini-bar', '2026-05-22 14:30:09', 1),
(3, 3, 1, 180000.00, 180000.00, 'Thuê xe máy 1 ngày', '2026-05-22 14:30:09', 2),
(4, 4, 2, 350000.00, 700000.00, 'Đặt 2 suất massage cặp đôi', '2026-05-22 14:30:09', 5),
(5, 1, 2, 50000.00, 100000.00, 'Giặt 2 bộ vest', '2026-05-22 14:30:09', 3);

-- --------------------------------------------------------

--
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `user_fk7` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
--

INSERT INTO `user` (`id`, `email`, `password_hash`, `full_name`, `phone`, `created_at`, `updated_at`, `role_id`) VALUES
(1, 'nguyenthanhcong@gmail.com', 'hash_pass_1', 'Nguyễn Thành Công', '0901234567', '2026-05-22 14:30:09', '2026-05-22 14:30:09', 1),
(2, 'nguyengiabao@gmail.com', 'hash_pass_2', 'Nguyễn Gia Bảo\r\n', '0912345678', '2026-05-22 14:30:09', '2026-05-22 14:30:09', 2),
(3, 'duongdinhdanh@gmail.com', 'hash_pass_3', 'Dương Đình Danh', '0923456789', '2026-05-22 14:30:09', '2026-05-22 14:30:09', 3),
(4, 'huynhquoccuong@gmail.com', 'hash_pass_4', 'Huỳnh Quốc Cường', '0934567890', '2026-05-22 14:30:09', '2026-05-22 14:30:09', 5),
(5, 'nguyenthanhduy@gmail.com', 'hash_pass_5', 'Nguyễn Thành Duy', '0945678901', '2026-05-22 14:30:09', '2026-05-22 14:30:09', 5),
(6, 'lethanhduy@gmail.com', 'hash_pass_6', 'Lê Thành Duy', '0956789012', '2026-05-22 14:30:09', '2026-05-22 14:30:09', 5);

--
--

--
--
ALTER TABLE `booking`
  ADD CONSTRAINT `booking_fk1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
--
ALTER TABLE `bookingdetail`
  ADD CONSTRAINT `bookingdetail_fk1` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`id`),
  ADD CONSTRAINT `bookingdetail_fk2` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`);

--
--
ALTER TABLE `checkinout`
  ADD CONSTRAINT `checkinout_fk1` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`id`),
  ADD CONSTRAINT `checkinout_fk2` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`),
  ADD CONSTRAINT `checkinout_fk3` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
--
ALTER TABLE `invoice`
  ADD CONSTRAINT `invoice_fk1` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`id`);

--
--
ALTER TABLE `invoicedetail`
  ADD CONSTRAINT `invoicedetail_fk1` FOREIGN KEY (`invoice_id`) REFERENCES `invoice` (`id`);

--
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_fk1` FOREIGN KEY (`invoice_id`) REFERENCES `invoice` (`id`),
  ADD CONSTRAINT `payment_fk2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
--
ALTER TABLE `room`
  ADD CONSTRAINT `room_fk5` FOREIGN KEY (`type_id`) REFERENCES `roomtype` (`id`);

--
--
ALTER TABLE `serviceusage`
  ADD CONSTRAINT `serviceusage_fk1` FOREIGN KEY (`service_id`) REFERENCES `service` (`id`),
  ADD CONSTRAINT `serviceusage_fk7` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`id`);

--
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_fk7` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
