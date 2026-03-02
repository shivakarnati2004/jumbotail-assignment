-- ============================================================
-- Jumbotail B2B E-Commerce — Seed Data
-- Problem statement entities + realistic Indian B2B data
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- CUSTOMERS (Kirana Stores across India)
-- First 2 are exact from the problem statement
-- ─────────────────────────────────────────────────────────────
INSERT INTO customers (name, phone, email, address, city, state, pincode, lat, lng, gst_number) VALUES
-- Problem statement customers
('Shree Kirana Store',       '9847000000', 'shree.kirana@email.com',     'Shop 12, MG Road',                    'Bengaluru',   'Karnataka',     '560001', 11.232,   23.445495, '29ABCDE1234F1Z5'),
('Andheri Mini Mart',        '9101000000', 'andheri.mart@email.com',     'Plot 45, Andheri West',               'Mumbai',      'Maharashtra',   '400058', 17.232,   33.445495, '27FGHIJ5678G2Y6'),
-- Real Indian Kirana stores
('Rajesh Provisions',        '9876543210', 'rajesh.prov@email.com',      'No 23, T Nagar Main Road',            'Chennai',     'Tamil Nadu',    '600017', 13.0827,  80.2707,   '33KLMNO9012H3X7'),
('Gupta General Store',      '9812345678', 'gupta.store@email.com',      'B-14, Connaught Place',               'New Delhi',   'Delhi',         '110001', 28.6139,  77.2090,   '07PQRST3456I4W8'),
('Lakshmi Traders',          '9745612380', 'lakshmi.trade@email.com',    'Road No 10, Jubilee Hills',           'Hyderabad',   'Telangana',     '500033', 17.3850,  78.4867,   '36UVWXY7890J5V9'),
('Om Sai Kirana',            '9654321098', 'omsai.kirana@email.com',     '76, Koregaon Park Road',              'Pune',        'Maharashtra',   '411001', 18.5362,  73.8936,   '27ZABCD1234K6U0'),
('Balaji Super Market',      '9543210987', 'balaji.super@email.com',     'Plot 8, Banjara Hills',               'Hyderabad',   'Telangana',     '500034', 17.4100,  78.4350,   '36EFGHI5678L7T1'),
('New India Stores',         '9432109876', 'newindia@email.com',         '22A, Park Street',                    'Kolkata',     'West Bengal',   '700016', 22.5726,  88.3639,   '19JKLMN9012M8S2'),
('Ravi Corner Shop',         '9321098765', 'ravi.corner@email.com',      'Sector 17, Chandigarh',               'Chandigarh',  'Punjab',        '160017', 30.7333,  76.7794,   '04MNOPQ3456N9R3'),
('Sharma Grocery Palace',    '9210987654', 'sharma.grocery@email.com',   '12, CI Road, Patna',                  'Patna',       'Bihar',         '800001', 25.6093,  85.1376,   '10RSTUV7890O0S4'),
('Mahalakshmi Stores',       '9109876543', 'mahalakshmi@email.com',      '34, Brigade Road',                    'Bengaluru',   'Karnataka',     '560025', 12.9716,  77.6070,   '29WXYZ01234P1T5'),
('Jain Provision House',     '9098765432', 'jain.prov@email.com',        '56, Lal Darwaja',                     'Ahmedabad',   'Gujarat',       '380001', 23.0225,  72.5714,   '24ABCDE5678Q2U6'),
('Priya Daily Needs',        '8987654321', 'priya.daily@email.com',      '78, MG Marg',                         'Gangtok',     'Sikkim',        '737101', 27.3314,  88.6138,   '11FGHIJ9012R3V7'),
('South Star Mart',          '8876543210', 'southstar@email.com',        '99, Beach Road',                      'Visakhapatnam','Andhra Pradesh','530001', 17.6868,  83.2185,   '37KLMNO3456S4W8'),
('Kerala Spice Corner',      '8765432109', 'keralaspice@email.com',      'MG Road, Ernakulam',                  'Kochi',       'Kerala',        '682011', 9.9312,   76.2673,   '32PQRST7890T5X9');

-- ─────────────────────────────────────────────────────────────
-- SELLERS (Suppliers / Manufacturers)
-- First 3 are exact from the problem statement
-- ─────────────────────────────────────────────────────────────
INSERT INTO sellers (name, phone, email, address, city, state, pincode, lat, lng, gst_number, rating) VALUES
-- Problem statement sellers
('Nestle Seller',              '9111222333', 'nestle.seller@email.com',   'Gurgaon Corporate Park, Sector 44',   'Gurgaon',     'Haryana',       '122001', 28.4595, 77.0266, '06AABCN1234P1Z5', 4.5),
('Rice Seller',                '9222333444', 'rice.seller@email.com',     'Grain Market, GT Karnal Road',        'Karnal',      'Haryana',       '132001', 29.6857, 76.9905, '06BBCDE5678Q2Y6', 4.2),
('Sugar Seller',               '9333444555', 'sugar.seller@email.com',    'Sugar Mill Colony, Dhampur',          'Dhampur',     'Uttar Pradesh', '246761', 29.3091, 78.5120, '09CCDEF9012R3X7', 4.0),
-- Real Indian FMCG sellers
('Hindustan Unilever Ltd',     '9444555666', 'hul.seller@email.com',      'Andheri East, MIDC',                  'Mumbai',      'Maharashtra',   '400093', 19.1136, 72.8697, '27DGHIJ3456S4W8', 4.8),
('ITC Foods Division',         '9555666777', 'itc.foods@email.com',       'ITC Green Centre, Benaras Road',      'Kolkata',     'West Bengal',   '700071', 22.5580, 88.3476, '19EKLMN7890T5V9', 4.6),
('Parle Products Pvt Ltd',     '9666777888', 'parle.prod@email.com',      'Parle Factory, Vile Parle East',      'Mumbai',      'Maharashtra',   '400057', 19.0968, 72.8517, '27FOPQR1234U6U0', 4.3),
('Amul Dairy (GCMMF)',         '9777888999', 'amul.dairy@email.com',      'Amul Dairy Road, Anand',              'Anand',       'Gujarat',       '388001', 22.5645, 72.9289, '24GSTUW5678V7T1', 4.7),
('Britannia Industries',       '9888999000', 'britannia@email.com',       'Whitefield Main Road',                'Bengaluru',   'Karnataka',     '560066', 12.9698, 77.7500, '29HVXYZ9012W8S2', 4.4),
('Dabur India Ltd',            '9999000111', 'dabur@email.com',           'Kaushambi, Ghaziabad',                'Ghaziabad',   'Uttar Pradesh', '201010', 28.6469, 77.3178, '09IABCD3456X9A3', 4.3),
('Tata Consumer Products',     '9000111222', 'tata.consumer@email.com',   'Jehangir Building, Fort',             'Mumbai',      'Maharashtra',   '400001', 18.9321, 72.8347, '27JEFGH7890Y0B4', 4.6),
('Godrej Consumer Products',   '9001112223', 'godrej@email.com',          'Godrej One, Pirojshanagar',           'Mumbai',      'Maharashtra',   '400079', 19.1100, 72.8900, '27KIJKL1234Z1C5', 4.2),
('Marico Ltd',                 '9002223334', 'marico@email.com',          'Marico Innovation Centre, Mahim',     'Mumbai',      'Maharashtra',   '400016', 19.0425, 72.8409, '27LMNOP5678A2D6', 4.1);

-- ─────────────────────────────────────────────────────────────
-- PRODUCTS
-- First product for each problem-statement seller has exact prices
-- ─────────────────────────────────────────────────────────────
INSERT INTO products (seller_id, name, description, category, price, weight_kg, dimension_l_cm, dimension_w_cm, dimension_h_cm, sku, stock_qty) VALUES
-- Nestle Seller products (seller_id=1)
('1', 'Maggi 500g Packet',          'Maggi 2-Minute Noodles 500g Family Pack',       'Instant Food',    10.00,   0.500,  10.0,   10.0,  10.0,  'NES-MAG-500',  5000),
('1', 'Nescafe Classic 200g',       'Nescafe Classic Instant Coffee Jar',            'Beverages',       350.00,  0.250,  12.0,   8.0,   15.0,  'NES-COF-200',  3000),
('1', 'KitKat Box (24 pcs)',        'Nestle KitKat Chocolate Wafer Box',             'Confectionery',   480.00,  1.200,  30.0,   20.0,  10.0,  'NES-KIT-024',  2000),
('1', 'Maggi Masala-ae-Magic 72g',  'Maggi Seasoning Sachet Bundle',                 'Instant Food',    30.00,   0.072,  8.0,    5.0,   2.0,   'NES-MAM-072',  8000),

-- Rice Seller products (seller_id=2)
('2', 'Rice Bag 10Kg',              'Premium Basmati Rice 10Kg Bag',                 'Grains & Rice',   500.00, 10.000, 1000.0, 800.0, 500.0, 'RIC-BAS-010',  8000),
('2', 'Brown Rice 5Kg',             'Organic Brown Rice 5Kg Pack',                   'Grains & Rice',   450.00,  5.000,  40.0,   25.0,  10.0,  'RIC-BRN-005',  4000),
('2', 'Sona Masoori Rice 25Kg',     'South Indian Sona Masoori Rice',                'Grains & Rice',   1200.00,25.000, 70.0,   50.0,  25.0,  'RIC-SON-025',  3000),

-- Sugar Seller products (seller_id=3)
('3', 'Sugar Bag 25Kg',             'Premium White Sugar Bag 25Kg',                  'Sugar & Jaggery', 700.00, 25.000, 1000.0, 900.0, 600.0, 'SUG-WHT-025',  6000),
('3', 'Jaggery Powder 1Kg',         'Organic Jaggery Powder Natural',                'Sugar & Jaggery', 120.00,  1.000,  20.0,   15.0,  8.0,   'SUG-JAG-001',  3000),
('3', 'Mishri Crystal Sugar 500g',  'Rock Sugar Misri Premium',                      'Sugar & Jaggery',  80.00,  0.500,  15.0,   10.0,  5.0,   'SUG-MIS-500',  4000),

-- Hindustan Unilever products (seller_id=4)
('4', 'Surf Excel 4Kg',             'Surf Excel Easy Wash Detergent Powder',         'Home Care',       550.00,  4.000,  35.0,   25.0,  12.0,  'HUL-SRF-004',  7000),
('4', 'Dove Soap Pack of 8',        'Dove Moisturising Beauty Bar 8-Pack',           'Personal Care',   400.00,  0.800,  25.0,   15.0,  10.0,  'HUL-DOV-008',  5000),
('4', 'Lifebuoy Handwash 5L',       'Lifebuoy Total 10 Handwash Refill',             'Personal Care',   450.00,  5.200,  30.0,   20.0,  15.0,  'HUL-LFB-005',  6000),
('4', 'Brooke Bond Red Label 1Kg',  'Red Label Natural Care Tea',                    'Beverages',       420.00,  1.000,  20.0,   12.0,  10.0,  'HUL-TEA-001',  8000),

-- ITC Foods products (seller_id=5)
('5', 'Aashirvaad Atta 10Kg',       'ITC Aashirvaad Superior Whole Wheat Atta',      'Grains & Rice',   480.00, 10.000,  50.0,   35.0,  18.0,  'ITC-AAT-010',  9000),
('5', 'Sunfeast Dark Fantasy',      'Sunfeast Dark Fantasy Choco Fills Box',         'Snacks',          360.00,  1.500,  30.0,   20.0,  15.0,  'ITC-SUN-BOX',  4000),
('5', 'Bingo Mad Angles Carton',    'Bingo Mad Angles Tomato Madness 12-Pack',       'Snacks',          240.00,  0.720,  35.0,   25.0,  20.0,  'ITC-BNG-012',  6000),
('5', 'Classmate Notebook Box',     'Classmate 180-page Long Notebook (20 pcs)',     'Stationery',      600.00,  5.000,  40.0,   30.0,  25.0,  'ITC-CLN-020',  3000),

-- Parle Products (seller_id=6)
('6', 'Parle-G Biscuit Carton',     'Parle-G Original Glucose Biscuits 800g x 12',  'Snacks',          200.00,  3.000,  45.0,   30.0,  25.0,  'PAR-PLG-CTN',  10000),
('6', 'Hide & Seek Box',            'Parle Hide & Seek Choco Chip Cookies 12-Pack', 'Snacks',          300.00,  1.200,  28.0,   18.0,  12.0,  'PAR-HNS-BOX',  5000),
('6', 'Melody Toffee Jar',          'Parle Melody Chocolaty Toffee 350 pcs Jar',    'Confectionery',   350.00,  1.800,  20.0,   20.0,  25.0,  'PAR-MEL-350',  4000),

-- Amul Dairy products (seller_id=7)
('7', 'Amul Butter 500g',           'Amul Pasteurised Butter 500g Pack',             'Dairy',           270.00,  0.500,  12.0,   8.0,   6.0,   'AML-BTR-500',  6000),
('7', 'Amul Cheese Block 1Kg',      'Amul Processed Cheese Block 1Kg',               'Dairy',           450.00,  1.000,  18.0,   10.0,  8.0,   'AML-CHS-001',  3000),
('7', 'Amul Gold Milk 1L (12 pcs)', 'Amul Gold Full Cream Milk 12-Pack',             'Dairy',           780.00,  12.000, 40.0,   30.0,  25.0,  'AML-MLK-012',  5000),
('7', 'Amul Masti Dahi 400g (20)',  'Amul Masti Curd 400g x 20',                    'Dairy',           600.00,  8.000,  35.0,   30.0,  20.0,  'AML-DAH-020',  4000),

-- Britannia Industries (seller_id=8)
('8', 'Britannia Bread',            'Britannia Premium White Bread Loaf',            'Bakery',           45.00,  0.400,  30.0,   12.0,  12.0,  'BRT-BRD-001',  8000),
('8', 'Good Day Butter Box',        'Britannia Good Day Butter Cookies 12-Pack',     'Snacks',          280.00,  1.000,  25.0,   18.0,  10.0,  'BRT-GDY-BOX',  5000),
('8', 'Marie Gold Carton',          'Britannia Marie Gold Tea Time Biscuit Carton',  'Snacks',          180.00,  2.400,  40.0,   25.0,  20.0,  'BRT-MRG-CTN',  7000),

-- Dabur products (seller_id=9)
('9', 'Dabur Real Juice 1L (12)',   'Dabur Real Mixed Fruit Juice 12-Pack',          'Beverages',       540.00,  12.500, 35.0,   25.0,  30.0,  'DBR-JUC-012',  4000),
('9', 'Dabur Honey 1Kg',            'Dabur 100% Pure Honey',                        'Health Foods',    380.00,  1.050,  15.0,   10.0,  18.0,  'DBR-HON-001',  5000),
('9', 'Dabur Chyawanprash 1Kg',     'Dabur Chyawanprash Double Immunity',            'Health Foods',    320.00,  1.100,  12.0,   12.0,  18.0,  'DBR-CHY-001',  3000),

-- Tata Consumer Products (seller_id=10)
('10', 'Tata Salt 1Kg (24 pcs)',    'Tata Salt Iodised Salt Box of 24',              'Essentials',      480.00,  24.000, 50.0,   40.0,  30.0,  'TAT-SLT-024',  9000),
('10', 'Tata Tea Gold 1Kg',         'Tata Tea Gold Leaf Tea Premium',                'Beverages',       520.00,  1.000,  20.0,   12.0,  25.0,  'TAT-TEA-001',  6000),
('10', 'Tata Sampann Chana Dal 1Kg','Tata Sampann Unpolished Chana Dal',             'Pulses & Lentils',135.00,  1.000,  25.0,   18.0,  6.0,   'TAT-CHL-001',  7000),

-- Godrej Consumer Products (seller_id=11)
('11', 'Cinthol Soap Pack of 8',    'Cinthol Original Bath Soap 8-Pack',             'Personal Care',   320.00,  0.800,  25.0,   15.0,  10.0,  'GDR-CIN-008',  5000),
('11', 'Godrej No.1 Soap 12-Pack',  'Godrej No.1 Natural Oil Soap Bundle',           'Personal Care',   360.00,  1.200,  30.0,   20.0,  10.0,  'GDR-NO1-012',  6000),
('11', 'Hit Cockroach Spray 625ml', 'Godrej HIT Spray for Cockroaches',              'Home Care',       280.00,  0.700,  8.0,    8.0,   28.0,  'GDR-HIT-625',  8000),

-- Marico products (seller_id=12)
('12', 'Parachute Coconut Oil 1L',  'Parachute 100% Pure Coconut Oil 1L Bottle',     'Personal Care',   230.00,  0.920,  10.0,   10.0,  25.0,  'MRC-PCO-001',  7000),
('12', 'Saffola Gold Oil 5L',       'Saffola Gold Blended Edible Oil',               'Cooking Oil',     850.00,  4.600,  18.0,   18.0,  30.0,  'MRC-SAF-005',  5000),
('12', 'True Elements Oats 1Kg',    'True Elements Old Fashioned Rolled Oats',       'Health Foods',    250.00,  1.000,  25.0,   18.0,  8.0,   'MRC-OAT-001',  4000);

-- ─────────────────────────────────────────────────────────────
-- WAREHOUSES
-- First 2 are exact from the problem statement
-- ─────────────────────────────────────────────────────────────
INSERT INTO warehouses (name, address, city, state, pincode, lat, lng, capacity) VALUES
-- Problem statement warehouses
('BLR_Warehouse',    'Electronic City Phase 2',                'Bengaluru',   'Karnataka',     '560100', 12.99999, 37.923273, 50000),
('MUMB_Warehouse',   'Bhiwandi Industrial Area',               'Mumbai',      'Maharashtra',   '421302', 11.99999, 27.923273, 75000),
-- Additional warehouses across India
('DEL_Warehouse',    'Manesar Industrial Area, IMT',           'Gurgaon',     'Haryana',       '122051', 28.3588,  76.9346,   60000),
('CHN_Warehouse',    'Ambattur Industrial Estate',             'Chennai',     'Tamil Nadu',    '600058', 13.1143,  80.1548,   40000),
('HYD_Warehouse',    'Shamshabad Logistics Park',              'Hyderabad',   'Telangana',     '501218', 17.2403,  78.4294,   45000),
('KOL_Warehouse',    'Dankuni Industrial Area',                'Kolkata',     'West Bengal',   '712311', 22.6732,  88.2892,   35000),
('AHM_Warehouse',    'Sanand GIDC Industrial Estate',          'Ahmedabad',   'Gujarat',       '382110', 22.9727,  72.3790,   40000),
('PUN_Warehouse',    'Chakan Industrial Area, MIDC',           'Pune',        'Maharashtra',   '410501', 18.7606,  73.8553,   45000),
('JAI_Warehouse',    'Sitapura Industrial Area',               'Jaipur',      'Rajasthan',     '302022', 26.7846,  75.8580,   30000),
('LKO_Warehouse',    'Amausi Industrial Area',                 'Lucknow',     'Uttar Pradesh', '226008', 26.7618,  80.8829,   35000);

-- ─────────────────────────────────────────────────────────────
-- ORDERS (mix of statuses and dates)
-- ─────────────────────────────────────────────────────────────
INSERT INTO orders (customer_id, seller_id, product_id, warehouse_id, quantity, delivery_speed, transport_mode, distance_km, shipping_charge, total_amount, status, order_date) VALUES
-- Delivered orders
(1,  1,  1,  1,  50,  'standard', 'Mini Van',   15.20,    22.80,    522.80,    'delivered',  '2026-01-10'),
(2,  4,  11, 2,  5,   'express',  'Truck',      142.50,   1716.00,  4466.00,   'delivered',  '2026-01-15'),
(3,  1,  2,  4,  20,  'standard', 'Mini Van',   8.30,     16.60,    7016.60,   'delivered',  '2026-01-18'),
(8,  8,  28, 6,  30,  'standard', 'Mini Van',   12.00,    14.40,    1364.40,   'delivered',  '2026-01-22'),
(11, 7,  23, 1,  15,  'express',  'Truck',      250.00,   3763.00,  7813.00,   'delivered',  '2026-01-25'),
(4,  10, 34, 3,  10,  'standard', 'Mini Van',   25.00,    1800.00,  6600.00,   'delivered',  '2026-01-28'),
(14, 9,  31, 4,  8,   'standard', 'Truck',      180.00,   3610.00,  7930.00,   'delivered',  '2026-02-01'),
-- Shipped orders
(5,  5,  16, 5,  2,   'express',  'Mini Van',   55.00,    342.00,   1302.00,   'shipped',    '2026-02-05'),
(6,  6,  20, 8,  20,  'standard', 'Mini Van',   22.10,    132.60,   4132.60,   'shipped',    '2026-02-08'),
(9,  2,  5,  3,  5,   'standard', 'Truck',      280.00,   28010.00, 30510.00,  'shipped',    '2026-02-10'),
(12, 12, 40, 7,  10,  'express',  'Truck',      150.00,   13812.00, 22312.00,  'shipped',    '2026-02-12'),
(15, 10, 36, 4,  50,  'standard', 'Mini Van',   35.00,    5260.00,  12010.00,  'shipped',    '2026-02-15'),
-- Processing orders
(7,  7,  22, 5,  25,  'express',  'Truck',      320.00,   4830.00,  16080.00,  'processing', '2026-02-18'),
(10, 3,  8,  10, 3,   'standard', 'Aeroplane',  850.00,   63760.00, 65860.00,  'processing', '2026-02-20'),
(13, 11, 37, 6,  40,  'standard', 'Mini Van',   18.00,    43.20,    12843.20,  'processing', '2026-02-22'),
-- Pending orders
(1,  4,  14, 1,  100, 'standard', 'Truck',      180.00,   36010.00, 78010.00,  'pending',    '2026-02-25'),
(2,  6,  21, 2,  30,  'express',  'Mini Van',   42.00,    232.56,   10732.56,  'pending',    '2026-02-27'),
(3,  9,  32, 4,  15,  'express',  'Mini Van',   65.00,    308.85,   5108.85,   'pending',    '2026-02-28'),
(4,  1,  4,  3,  200, 'standard', 'Mini Van',   30.00,    22.88,    6022.88,   'pending',    '2026-03-01'),
(5,  12, 39, 5,  6,   'express',  'Truck',      400.00,   6818.40,  11918.40,  'pending',    '2026-03-02');
