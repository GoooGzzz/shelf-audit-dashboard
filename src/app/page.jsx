'use client';

import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { AlertOctagon, Copy, MapPin, FileWarning, Target, Users } from 'lucide-react';

// PASTE FULL CSV FROM FILE
const csvContent = `Week#,Day#,Emp Code,Emp Name,Title Name,Shop Code,Shop Name,Shelf Share,Shelf Share,Shelf Share,AV,AV,AV,AV,AV,AV,AV,AV,AV,AV,AV,AV,AV,AV,AV,AV,AV,AV,AV,AV,AV,AV,AV,AV,AV,AV,AV,AV,AV,AV,REF,REF,REF,REF,REF,REF,REF,REF,REF,REF,REF,REF,REF,REF,REF,REF,REF,REF,REF,REF,REF,REF,REF,REF,REF,WM,WM,WM,WM,WM,WM,WM,WM,WM,WM,WM,WM,WM,WM,WM,WM,WM,WM,WM
,,,,,,,AV,REF,WM,Samsung,LG,Fresh,Haier,ATA,Beko,Caixun,Castle,Grand,Grouhy,Hisense,Hoho,Hyundai,Jac,KAJITO,Levon,MG,Mirage,Nautical,Other,Sary,Sharp,SKYLINE,TCL,Tornado,Toshiba,Tromma,Ultra,Unionaire,Xiaomi,Samsung,LG,Fresh,Haier,Alaska,Ariston,Beko,Bosch,ELECTROSTAR,Gorenje,Hamburg,Hisense,Kiriazi,Midea,Other,Passap,Sharp,Siltal,Tornado,Toshiba,Toshiba Midea,Unionaire,White Point,White Whale,Zanussi,Samsung,LG,Fresh,Haier,Beko,Bosch,Hisense,Hitachi,HOOVER,Midea,Ocean,Other,Sharp,Tornado,Toshiba,Toshiba Midea,Unionaire,White Point,Zanussi
W43,10/21,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-12725-001,Gresh Center (Ismailia),11,8,5,,2,,,4,,,,,,,,,5,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,1,5,,,,,,,,,,,,,,,,,,,2,1,,,,2
W43,10/23,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-12725-001,Gresh Center (Ismailia),11,8,5,,2,,,4,,,,,,,,,5,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,1,5,,,,,,,,,,,,,,,,,,,2,1,,,,2
W44,10/25,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-12725-001,Gresh Center (Ismailia),11,8,5,,2,,,4,,,,,,,,,5,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,1,5,,,,,,,,,,,,,,,,,,,2,1,,,,2
W44,10/28,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-12725-001,Gresh Center (Ismailia),11,8,5,,2,,,4,,,,,,,,,5,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,1,5,,,,,,,,,,,,,,,,,,,2,1,,,,2
W44,10/30,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-12725-001,Gresh Center (Ismailia),,8,5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,1,5,,,,,,,,,,,,,,,,,,,2,1,,,,2
W45,11/2,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-12725-001,Gresh Center (Ismailia),,8,5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,1,5,,,,,,,,,,,,,,,,,,,2,1,,,,2
W45,11/6,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-12725-001,Gresh Center (Ismailia),,8,5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,1,5,,,,,,,,,,,,,,,,,,,2,1,,,,2
W43,10/20,A-1888,Ahmed Ali Ahmed Abd El Mageed Ramadan,Merchandiser,S-12677-001,Abo Yousef (Talkha),4,11,6,,1,2,,,,1,,,,,,,,,,,,,,,,,,,,,,,,,1,1,,,,3,,,,,,1,,,,1,,1,,3,,,,,,1,,,,,,,,,,,,2,,1,,,2
W43,10/22,A-1888,Ahmed Ali Ahmed Abd El Mageed Ramadan,Merchandiser,S-12677-001,Abo Yousef (Talkha),4,11,6,,1,2,,,,1,,,,,,,,,,,,,,,,,,,,,,,,,1,1,,,,3,,,,,,1,,,,1,,1,,3,,,,,,1,,,,,,,,,,,,2,,1,,,2
W44,10/27,A-1888,Ahmed Ali Ahmed Abd El Mageed Ramadan,Merchandiser,S-12677-001,Abo Yousef (Talkha),4,12,6,,1,2,,,,1,,,,,,,,,,,,,,,,,,,,,,,,,1,1,,,,3,,,,,,1,,,,1,,2,,3,,,,,,1,,,,,,,,,,,,2,,1,,,2
W44,10/29,A-1888,Ahmed Ali Ahmed Abd El Mageed Ramadan,Merchandiser,S-12677-001,Abo Yousef (Talkha),,12,6,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,1,,,,3,,,,,,1,,,,1,,2,,3,,,,,,1,,,,,,,,,,,,2,,1,,,2
W45,11/3,A-1888,Ahmed Ali Ahmed Abd El Mageed Ramadan,Merchandiser,S-12677-001,Abo Yousef (Talkha),,12,6,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,1,,,,3,,,,,,1,,,,1,,2,,3,,,,,,1,,,,,,,,,,,,2,,1,,,2
W45,11/6,A-1888,Ahmed Ali Ahmed Abd El Mageed Ramadan,Merchandiser,S-12677-001,Abo Yousef (Talkha),,12,6,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,1,,,,3,,,,,,1,,,,1,,2,,3,,,,,,1,,,,,,,,,,,,2,,1,,,2
W43,10/21,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-12679-001,Abo El Dahab (Bani Sweif),3,6,5,1,,1,,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,4,,,,,,,,,,,,,,,,,1,,1,,,,,1,3,,,,,,,,,,,1,,,,,
W44,10/25,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-12679-001,Abo El Dahab (Bani Sweif),3,10,3,1,,1,,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,4,,,,1,,,,,,,,,,3,,,1,,,,1,,,,2,,,,,,,,,,,1,,,,,
W44,10/28,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-12679-001,Abo El Dahab (Bani Sweif),3,12,4,1,,1,,,,,,,,,,,,,,,,,1,,,,,,,,,,,,1,4,1,,,1,,,,,,,,,,3,,,1,,,,1,,,,3,,,,,,,,,,,1,,,,,
W45,11/2,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-12679-001,Abo El Dahab (Bani Sweif),,7,3,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,,,,,,,,,,,3,,,,,,,,,,,3,,,,,,,,,,,,,,,,
W44,10/26,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-12735-001,Awlad Abo Zied (Minya),3,6,2,,,,,1,,,,,2,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,1,,,,2,,,,,,,,1,,,,,,,,2,,,,,,,,,,,,,,,
W45,11/4,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-12735-001,Awlad Abo Zied (Minya),,3,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,1,,,,,,,,1,,,,,,,,2,,,,,,,,,,,,,,,
W43,10/20,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-12758-001,Maraad Adelko,7,7,5,3,,2,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,,,,,,,,,,,3,,,,,,,,,,,,2,,,,,,,,,,3,,,,,
W44,10/27,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-12758-001,Maraad Adelko,7,11,3,3,,2,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,,,,,,,,,,,,,4,,3,,,,,,,,2,,,,,,,,,,,,1,,,
W44,10/28,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-12758-001,Maraad Adelko,8,15,6,3,1,2,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,4,1,,,,,,,,,,,,,3,,4,,3,,,,,,,1,2,,,,,,,,,,3,,,,,
W45,11/4,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-12758-001,Maraad Adelko,,12,5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,4,1,,,,,,,,,,,,,,,4,,3,,,,,,,,2,,,,,,,,,,,,3,,,
W43,10/20,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-1003-001,Emad El Den (Ismailia),21,12,8,5,3,3,,3,,,,,,,1,,3,,,,,,3,,,,,,,,,,,,,3,,,,,,,,,,,,4,,,,1,3,,,,,1,,,,,,,,,,,,6,,1,,,,,1
W44,10/27,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-1003-001,Emad El Den (Ismailia),21,12,8,5,3,3,,3,,,,,,,1,,3,,,,,,3,,,,,,,,,,,,,3,,,,,,,,,,,,4,,,,1,3,,,,,1,,,,,,,,,,,,6,,1,,,,,1
W45,11/4,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-1003-001,Emad El Den (Ismailia),,12,8,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,,,4,,,,1,3,,,,,1,,,,,,,,,,,,6,,1,,,,,1
W43,10/20,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-1021-001,Grand Home,19,19,10,4,1,2,,3,,,,,,,2,,2,,,,,,5,,,,,,,,,,,,,4,,,,1,,,,,,,,3,,2,,1,3,,2,,2,1,,,1,,,,,,,,,4,,1,1,,1,,2
W43,10/22,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-1021-001,Grand Home,19,19,10,4,1,2,,3,,,,,,,2,,2,,,,,,5,,,,,,,,,,,,,4,,,,1,,,,,,,,3,,2,,1,3,,2,,2,1,,,1,,,,,,,,,4,,1,1,,1,,2
W44,10/27,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-1021-001,Grand Home,19,19,10,4,1,2,,3,,,,,,,2,,2,,,,,,5,,,,,,,,,,,,,4,,,,1,,,,,,,,3,,2,,1,3,,2,,2,1,,,1,,,,,,,,,4,,1,1,,1,,2
W44,10/29,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-1021-001,Grand Home,,19,10,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,1,,,,,,,,3,,2,,1,3,,2,,2,1,,,1,,,,,,,,,4,,1,1,,1,,2
W45,11/4,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-1021-001,Grand Home,,19,10,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,1,,,,,,,,3,,2,,1,3,,2,,2,1,,,1,,,,,,,,,4,,1,1,,1,,2
W44,10/26,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-11060-001,Marad Shahd,2,8,9,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,2,,,3,,,,1,2,,,,,3,,,,,,,,1,,,1,2,,2,,,
W45,11/3,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-11060-001,Marad Shahd,,8,9,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,3,,,,1,2,,,,,3,,,,,,,,1,,,1,2,,2,,,
W43,10/20,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-11177-001,El Adawy Home,15,18,8,3,1,2,,2,,,,,,,1,,3,,,,,,3,,,,,,,,,,,,,3,,,,2,,,,,,,,3,,1,,1,3,,3,,,2,,,1,,,,,,,,,5,,,1,,,,1
W43,10/22,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-11177-001,El Adawy Home,15,18,8,3,1,2,,2,,,,,,,1,,3,,,,,,3,,,,,,,,,,,,,3,,,,2,,,,,,,,3,,1,,1,3,,3,,,2,,,1,,,,,,,,,5,,,1,,,,1
W44,10/27,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-11177-001,El Adawy Home,15,18,8,3,1,2,,2,,,,,,,1,,3,,,,,,3,,,,,,,,,,,,,3,,,,2,,,,,,,,3,,1,,1,3,,3,,,2,,,1,,,,,,,,,5,,,1,,,,1
W44,10/29,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-11177-001,El Adawy Home,,18,8,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,2,,,,,,,,3,,1,,1,3,,3,,,2,,,1,,,,,,,,,5,,,1,,,,1
W45,11/4,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-11177-001,El Adawy Home,,18,8,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,2,,,,,,,,3,,1,,1,3,,3,,,2,,,1,,,,,,,,,5,,,1,,,,1
W43,10/20,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-11289-001,El Takwa,4,14,13,1,,3,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,1,,,,2,,,,,,,,,,3,,2,,3,,2,,,,4,,,,,,,1,2,,,1,2,,1,,2,
W43,10/22,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-11289-001,El Takwa,4,14,13,1,,3,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,1,,,,2,,,,,,,,,,3,,2,,3,,2,,,,4,,,,,,,1,2,,,1,2,,1,,2,
W44,10/27,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-11289-001,El Takwa,4,14,13,1,,3,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,1,,,,2,,,,,,,,,,3,,2,,3,,2,,,,4,,,,,,,1,2,,,1,2,,1,,2,
W44,10/29,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-11289-001,El Takwa,,14,13,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,1,,,,2,,,,,,,,,,3,,2,,3,,2,,,,4,,,,,,,1,2,,,1,2,,1,,2,
W45,11/4,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-11289-001,El Takwa,,14,13,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,1,,,,2,,,,,,,,,,3,,2,,3,,2,,,,4,,,,,,,1,2,,,1,2,,1,,2,
W45,11/6,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-11289-001,El Takwa,,14,13,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,1,,,,2,,,,,,,,,,3,,2,,3,,2,,,,4,,,,,,,1,2,,,1,2,,1,,2,
W43,10/20,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-1154-002,Modern House,8,11,,,,1,,,,,2,,,,,,2,,,,,,,,,,,3,,,,,,,,3,,,,,,2,,,,3,,,,,,,3,,,,,,,,,,,,,,,,,,,,,,,,
W44,10/27,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-1154-002,Modern House,8,10,,,,1,,,,,2,,,,,,2,,,,,,,,,,,3,,,,,,,,3,,,,,,2,,,,3,,,,,,,2,,,,,,,,,,,,,,,,,,,,,,,,
W44,10/30,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-1154-002,Modern House,,8,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,,,2,,,,3,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
W45,11/3,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-1154-002,Modern House,,8,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,,,2,,,,3,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
W44,10/26,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-11804-001,El Tahan Center,19,22,7,6,2,2,,2,,,,,,,1,,3,,,,,,3,,,,,,,,,,,,,3,3,,,1,,,,,,,,3,,1,,1,2,,3,1,2,2,,,,,,,,,,,,5,,,1,,,,1
W45,11/3,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-11804-001,El Tahan Center,,22,7,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,3,,,1,,,,,,,,3,,1,,1,2,,3,1,2,2,,,,,,,,,,,,5,,,1,,,,1
W43,10/20,A-2120,Mohamed Abo El Ezz Zaki Mohamed,Merchandiser,S-11961-002,BS-IR-Naga Hamady,6,3,7,6,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,,,,,,,,,,,,,,,,7,,,,,,,,,,,,,,,,,,
W43,10/22,A-2120,Mohamed Abo El Ezz Zaki Mohamed,Merchandiser,S-11961-002,BS-IR-Naga Hamady,6,3,7,6,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,,,,,,,,,,,,,,,,7,,,,,,,,,,,,,,,,,,
W44,10/25,A-2120,Mohamed Abo El Ezz Zaki Mohamed,Merchandiser,S-11961-002,BS-IR-Naga Hamady,6,3,7,6,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,,,,,,,,,,,,,,,,7,,,,,,,,,,,,,,,,,,
W44,10/29,A-2120,Mohamed Abo El Ezz Zaki Mohamed,Merchandiser,S-11961-002,BS-IR-Naga Hamady,6,3,7,6,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,,,,,,,,,,,,,,,,7,,,,,,,,,,,,,,,,,,
W45,11/4,A-2120,Mohamed Abo El Ezz Zaki Mohamed,Merchandiser,S-11961-002,BS-IR-Naga Hamady,6,3,7,6,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,,,,,,,,,,,,,,,,7,,,,,,,,,,,,,,,,,,
W45,11/5,A-2120,Mohamed Abo El Ezz Zaki Mohamed,Merchandiser,S-11961-002,BS-IR-Naga Hamady,6,3,7,6,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,,,,,,,,,,,,,,,,7,,,,,,,,,,,,,,,,,,
W43,10/20,A-2860,Sameh Abd El Mohsen Abd El Aziz Farghal,Promoter,S-11961-002,BS-IR-Naga Hamady,6,,,6,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
W45,11/2,A-2860,Sameh Abd El Mohsen Abd El Aziz Farghal,Promoter,S-11961-002,BS-IR-Naga Hamady,,,3,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,,,,,,,,,
W44,10/26,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-12187-001,Maarad Hozain (Meet Ghamr),6,11,8,,,2,,,,,,,,,,,,,,,,3,,,,,,,,,,1,,,,,,,,,,2,,,,,,,,3,,3,,1,2,,,,,2,,,,,,,,2,,,2,1,,1,,,
W45,11/3,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-12187-001,Maarad Hozain (Meet Ghamr),,11,8,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,3,,3,,1,2,,,,,2,,,,,,,,2,,,2,1,,1,,,
W45,11/3,A-3277,Mahmoud Mohamed Hassan El Etreby,Promoter,S-12206-002,BS-IR-Tanta,,2,5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,,,,,,,,,,5,,,,,,,,,,,,,,,,,,
W45,11/4,A-3277,Mahmoud Mohamed Hassan El Etreby,Promoter,S-12206-002,BS-IR-Tanta,12,6,5,12,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,6,,,,,,,,,,,,,,,,,,,,,,,,,5,,,,,,,,,,,,,,,,,,
W45,11/6,A-3277,Mahmoud Mohamed Hassan El Etreby,Promoter,S-12206-002,BS-IR-Tanta,12,6,5,12,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,6,,,,,,,,,,,,,,,,,,,,,,,,,5,,,,,,,,,,,,,,,,,,
W43,10/20,A-3441,Ahmed Abd El Aziz Mohamed Morsy,Merchandiser,S-12206-002,BS-IR-Tanta,9,,,9,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
W44,10/27,A-3441,Ahmed Abd El Aziz Mohamed Morsy,Merchandiser,S-12206-002,BS-IR-Tanta,9,1,4,9,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,,,,,,,,,,,,,,,
W45,11/2,A-3441,Ahmed Abd El Aziz Mohamed Morsy,Merchandiser,S-12206-002,BS-IR-Tanta,9,1,4,9,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,,,,,,,,,,,,,,,
W44,10/25,A-2303,Mahmoud Mustafa Mohamed Bawab,Trainner,S-12224-001,El Barkawy (Minya),11,14,7,,,2,,1,,,,,,,,,,,,1,3,,,,4,,,,,,,,,,,3,,,,,,,,,,3,3,,,2,,3,,,,,,,,,1,1,,,,,,4,,,,,1,,,,
W45,11/4,A-2303,Mahmoud Mustafa Mohamed Bawab,Trainner,S-12224-001,El Barkawy (Minya),,15,7,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,3,3,,,2,,3,,1,,,,,,,1,1,,,,,,4,,,,,1,,,,
W43,10/20,A-2796,Ahmed Samy Abd El Aziz Abd El Ghany Khrwela,Merchandiser,S-12776-001,El Bahrawy (Victoria),7,3,2,,,,,,,,,,,5,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,1,,,,,,,,,2,,,,,,,,,,,,,,,,,,,,2,,,
W44,10/27,A-2796,Ahmed Samy Abd El Aziz Abd El Ghany Khrwela,Merchandiser,S-12776-001,El Bahrawy (Victoria),7,3,2,,,,,,,,,,,5,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,1,,,,,,,,,2,,,,,,,,,,,,,,,,,,,,2,,,
W44,10/29,A-2796,Ahmed Samy Abd El Aziz Abd El Ghany Khrwela,Merchandiser,S-12776-001,El Bahrawy (Victoria),,3,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,2,,,,,,,,,,,,,,,,,,,,2,,,
W45,11/3,A-2796,Ahmed Samy Abd El Aziz Abd El Ghany Khrwela,Merchandiser,S-12776-001,El Bahrawy (Victoria),9,3,2,,,,,,,,,,,7,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,1,,,,,,,,,2,,,,,,,,,,,,,,,,,,,,2,,,
W44,10/25,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-12836-001,Morad Stores (Ismailia),18,18,9,3,2,2,,3,,,,,,,2,,3,,,,,,3,,,,,,,,,,,,,3,,,,1,,,,,,,,3,,,,1,3,,2,,3,2,,,1,,,,,,,,,4,,2,1,,,1,
W45,11/2,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-12836-001,Morad Stores (Ismailia),,18,9,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,1,,,,,,,,3,,,,1,3,,2,,3,2,,,1,,,,,,,,,4,,2,1,,,1,
W43,10/20,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-12932-001,Maarad Farghaly,6,8,2,,,,,3,,,2,,,,,,,,,,1,,,,,,,,,,,,,,,4,,,,,,,,,,2,,,,,,,1,,1,,,,,,1,,,,,,,,,,,,1,,,,
W43,10/23,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-12932-001,Maarad Farghaly,6,8,2,,,,,3,,,2,,,,,,,,,,1,,,,,,,,,,,,,,,4,,,,,,,,,,2,,,,,,,1,,1,,,,,,1,,,,,,,,,,,,1,,,,
W44,10/27,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-12932-001,Maarad Farghaly,6,7,2,,,,,3,,,2,,,,,,,,,,1,,,,,,,,,,,,,,,4,,,,,,,,,,2,,,,,,,,,1,,,,,,1,,,,,,,,,,,,1,,,,
W45,11/3,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-12932-001,Maarad Farghaly,,7,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,,,,,,,2,,,,,,,,,1,,,,,,1,,,,,,,,,,,,1,,,,
W44,10/26,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-12964-001,Maarad Karnaval,2,6,8,,,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,2,,1,,,,,,1,,,,,,,,1,,,2,3,,1,,,
W45,11/3,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-12964-001,Maarad Karnaval,,6,8,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,2,,1,,,,,,1,,,,,,,,1,,,2,3,,1,,,
W43,10/21,A-3179,Mohamed Sayed El Metwaly Mohamed,Merchandiser,S-13474-001,Maarad Top Tech (Faiyum),,5,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,2,,,,,,,,,,2,,,,,,,,,,,1,,,,,,,,,,,1,,,,,
W44,10/25,A-3179,Mohamed Sayed El Metwaly Mohamed,Merchandiser,S-13474-001,Maarad Top Tech (Faiyum),2,9,3,,,,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,2,,,2,,,,,,,,,,2,,1,,,,,,,,1,,2,,,,,,,,,,,,,,,
W44,10/28,A-3179,Mohamed Sayed El Metwaly Mohamed,Merchandiser,S-13474-001,Maarad Top Tech (Faiyum),2,3,3,,,,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,1,,,,,,,,,,2,,,,,,,,,,1,,,,,
W45,11/4,A-3179,Mohamed Sayed El Metwaly Mohamed,Merchandiser,S-13474-001,Maarad Top Tech (Faiyum),,6,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,2,,,,,,,,,,,,,2,,,,,,,,,,1,,,,,,,,,,,,,,,,,
W43,10/22,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-13475-001,Maarad Dorra (Bani Sweif),5,11,8,2,2,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,2,,,,3,,,,,,,,,,1,,,,,,1,3,,4,,2,,,,,,,,,,,,,,,1,1
W44,10/26,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-13475-001,Maarad Dorra (Bani Sweif),3,10,2,3,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,2,,,,3,,,,,,,,,,1,,,,,,,3,,2,,,,,,,,,,,,,,,,,,
W44,10/28,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-13475-001,Maarad Dorra (Bani Sweif),4,10,5,3,,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,2,,,,3,,,,,,,,,,1,,,,,,,3,,4,,,,,,,,,,,,,,,,,,1
W44,10/29,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-13475-001,Maarad Dorra (Bani Sweif),,10,6,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,2,,,,3,,,,,,,,,,1,,,,,,,3,,2,,2,,,,,,,,,,,,,,,1,1
W45,11/3,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-13475-001,Maarad Dorra (Bani Sweif),,9,3,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,2,,,,3,,,,,,,,,,,,,,,,,3,,,,2,,,,,,,,,,,,,,,1,
W45,11/5,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-13475-001,Maarad Dorra (Bani Sweif),,11,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,2,1,,,3,,,,,,,,,,1,,,,,,,3,,,,2,1,,,,,,,,,,,,,,,1
W44,10/25,A-3179,Mohamed Sayed El Metwaly Mohamed,Merchandiser,S-13664-001,El Safa & El Marwa (Faiyum),6,,,,,2,2,1,,,,,,,,,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
W45,11/4,A-3179,Mohamed Sayed El Metwaly Mohamed,Merchandiser,S-13664-001,El Safa & El Marwa (Faiyum),,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,,,,,,,,,,
W44,10/25,A-1888,Ahmed Ali Ahmed Abd El Mageed Ramadan,Merchandiser,S-14075-001,Mohamed Zoghly (Mansoura),10,15,12,,1,2,1,,,1,,,,,,,2,,,,,,,2,,,,1,,,,,,2,1,,,,,3,,,,,1,,1,,,1,,3,,2,,1,,,2,2,,1,,,,,,,,,2,1,,1,,1,2
W45,11/4,A-1888,Ahmed Ali Ahmed Abd El Mageed Ramadan,Merchandiser,S-14075-001,Mohamed Zoghly (Mansoura),6,16,11,,,2,,,,,,,,,,,1,,,,,,,2,,,,1,,,,,,3,1,,,,,3,,,,,1,,1,,,1,,3,,2,,1,,,1,2,,1,,,,,,,,,2,1,,1,,1,2
W44,10/26,A-1888,Ahmed Ali Ahmed Abd El Mageed Ramadan,Merchandiser,S-14076-001,Aalam El Tawfeer (Mansoura),7,17,11,1,2,1,,,,1,,,,,,,1,,,,,,1,,,,,,,,,,,1,4,1,,,,2,,,,,,1,,,,1,,3,,2,1,,1,,1,2,,,,,,,,,,,1,1,,2,,1,3
W45,11/2,A-1888,Ahmed Ali Ahmed Abd El Mageed Ramadan,Merchandiser,S-14076-001,Aalam El Tawfeer (Mansoura),,16,11,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,4,1,,,,2,,,,,,1,,,,1,,3,,2,1,,1,,1,2,,,,,,,,,,,1,1,,2,,1,3
W43,10/22,A-2259,Ahmed Farouk Ahmed El Sayed,Promoter,S-4682-093,Raya (Tagmoa),52,3,3,28,16,2,,,,,,,,,,,,,,,,,3,,2,,,1,,,,,,3,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,,,,,,,,,
W43,10/23,A-2259,Ahmed Farouk Ahmed El Sayed,Promoter,S-4682-093,Raya (Tagmoa),52,3,3,28,16,2,,,,,,,,,,,,,,,,,3,,2,,,1,,,,,,3,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,,,,,,,,,
W43,10/24,A-2259,Ahmed Farouk Ahmed El Sayed,Promoter,S-4682-093,Raya (Tagmoa),52,3,3,28,16,2,,,,,,,,,,,,,,,,,3,,2,,,1,,,,,,3,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,,,,,,,,,
W44,10/25,A-2259,Ahmed Farouk Ahmed El Sayed,Promoter,S-4682-093,Raya (Tagmoa),52,3,3,28,16,2,,,,,,,,,,,,,,,,,3,,2,,,1,,,,,,3,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,,,,,,,,,
W44,10/26,A-2259,Ahmed Farouk Ahmed El Sayed,Promoter,S-4682-093,Raya (Tagmoa),53,4,6,29,16,2,,,,,,,,,,,,,,,,,3,,2,,,1,,,,,,4,,,,,,,,,,,,,,,,,,,,,,,,,6,,,,,,,,,,,,,,,,,,
W44,10/27,A-2259,Ahmed Farouk Ahmed El Sayed,Promoter,S-4682-093,Raya (Tagmoa),53,4,6,29,16,2,,,,,,,,,,,,,,,,,3,,2,,,1,,,,,,4,,,,,,,,,,,,,,,,,,,,,,,,,6,,,,,,,,,,,,,,,,,,
W44,10/29,A-2259,Ahmed Farouk Ahmed El Sayed,Promoter,S-4682-093,Raya (Tagmoa),53,4,6,29,16,2,,,,,,,,,,,,,,,,,3,,2,,,1,,,,,,4,,,,,,,,,,,,,,,,,,,,,,,,,6,,,,,,,,,,,,,,,,,,
W44,10/30,A-2259,Ahmed Farouk Ahmed El Sayed,Promoter,S-4682-093,Raya (Tagmoa),53,4,6,29,16,2,,,,,,,,,,,,,,,,,3,,2,,,1,,,,,,4,,,,,,,,,,,,,,,,,,,,,,,,,6,,,,,,,,,,,,,,,,,,
W44,10/31,A-2259,Ahmed Farouk Ahmed El Sayed,Promoter,S-4682-093,Raya (Tagmoa),53,4,6,29,16,2,,,,,,,,,,,,,,,,,3,,2,,,1,,,,,,4,,,,,,,,,,,,,,,,,,,,,,,,,6,,,,,,,,,,,,,,,,,,
W45,11/2,A-2259,Ahmed Farouk Ahmed El Sayed,Promoter,S-4682-093,Raya (Tagmoa),53,4,6,29,16,2,,,,,,,,,,,,,,,,,3,,2,,,1,,,,,,4,,,,,,,,,,,,,,,,,,,,,,,,,6,,,,,,,,,,,,,,,,,,
W45,11/3,A-2259,Ahmed Farouk Ahmed El Sayed,Promoter,S-4682-093,Raya (Tagmoa),53,4,6,29,16,2,,,,,,,,,,,,,,,,,3,,2,,,1,,,,,,4,,,,,,,,,,,,,,,,,,,,,,,,,6,,,,,,,,,,,,,,,,,,
W45,11/5,A-2259,Ahmed Farouk Ahmed El Sayed,Promoter,S-4682-093,Raya (Tagmoa),45,,,29,16,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
W45,11/6,A-2259,Ahmed Farouk Ahmed El Sayed,Promoter,S-4682-093,Raya (Tagmoa),45,,,29,16,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
W45,11/7,A-2259,Ahmed Farouk Ahmed El Sayed,Promoter,S-4682-093,Raya (Tagmoa),53,4,6,29,16,2,,,,,,,,,,,,,,,,,3,,2,,,1,,,,,,4,,,,,,,,,,,,,,,,,,,,,,,,,6,,,,,,,,,,,,,,,,,,
W44,10/26,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-5124-001,El Reda Group,8,8,2,,,2,,,,,2,,,,,,2,,,,,,,,,,,2,,,,,,,,4,1,,,,,,,,,,,,,1,,2,,,,,,,,,,,,,,,2,,,,,,,,,,
W45,11/4,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-5124-001,El Reda Group,,11,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,4,1,,,,,,,,,,,,,3,,3,,,,,,,,,,,,,,,2,,,,,,,,,,
W44,10/26,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-5370-001,El Banawy,6,12,8,1,,3,,,,,,,2,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,3,2,,2,,2,,1,,,2,1,,,,,,,,,,,,2,,1,,2,
W45,11/3,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-5370-001,El Banawy,,12,6,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,3,2,,2,,2,,1,,,,1,,,,,,,,,,,,2,,1,,2,
W45,11/5,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-5370-001,El Banawy,,12,7,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,3,2,,2,,2,,1,,,,1,,,,,,,1,,,,,2,,1,,2,
W43,10/20,A-1605,Michael Magdy Kamal Khalil,Merchandiser,S-7017-002,Abo El Naga 2 (Portsaied),13,6,10,5,4,,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,2,,,,,,,,,,,,,3,,,,,,2,,2,,2,,,,,,,,,,1,,,3
W43,10/21,A-1605,Michael Magdy Kamal Khalil,Merchandiser,S-7017-002,Abo El Naga 2 (Portsaied),13,6,10,5,4,,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,2,,,,,,,,,,,,,3,,,,,,2,,2,,2,,,,,,,,,,1,,,3
W44,10/27,A-1605,Michael Magdy Kamal Khalil,Merchandiser,S-7017-002,Abo El Naga 2 (Portsaied),13,6,10,5,4,,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,2,,,,,,,,,,,,,3,,,,,,2,,2,,2,,,,,,,,,,1,,,3
W44,10/28,A-1605,Michael Magdy Kamal Khalil,Merchandiser,S-7017-002,Abo El Naga 2 (Portsaied),15,6,10,6,5,,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,2,,,,,,,,,,,,,3,,,,,,2,,2,,2,,,,,,,,,,1,,,3
W44,10/29,A-1605,Michael Magdy Kamal Khalil,Merchandiser,S-7017-002,Abo El Naga 2 (Portsaied),,6,10,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,2,,,,,,,,,,,,,3,,,,,,2,,2,,2,,,,,,,,,,1,,,3
W45,11/3,A-1605,Michael Magdy Kamal Khalil,Merchandiser,S-7017-002,Abo El Naga 2 (Portsaied),,6,10,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,2,,,,,,,,,,,,,3,,,,,,2,,2,,2,,,,,,,,,,1,,,3
W43,10/22,A-3295,Samy Attia Mohamed Attia,Merchandiser,S-7088-001,Awlad Mahmoud 1,18,2,10,3,2,1,1,,,,3,,,,,,5,,,,1,,,,,,,1,1,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,1,1,,2,,,,,,,,,,,,5,,,1
W44,10/26,A-3295,Samy Attia Mohamed Attia,Merchandiser,S-7088-001,Awlad Mahmoud 1,19,2,11,4,2,1,1,,,,3,,,,,,5,,,,1,,,,,,,1,1,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,1,1,,2,,1,,,,,,,,,,5,,,1
W45,11/3,A-3295,Samy Attia Mohamed Attia,Merchandiser,S-7088-001,Awlad Mahmoud 1,16,,5,4,2,1,1,,,,,,,,,,5,,,,1,,,,,,,1,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,1,,,,1,,1,,,,,,,,,,,1
W44,10/29,A-3226,Mahmoud Abdo Mohamed Abd El Salam,Merchandiser,S-7094-001,El Baraka 1,3,12,14,,,,,,,,,,,3,,,,,,,,,,,,,,,,,,,,,,3,,,,,,,,,2,,1,,,2,,2,,2,,,,,4,2,,,,,2,,2,2,,,2,,,,,,
W44,10/30,A-3226,Mahmoud Abdo Mohamed Abd El Salam,Merchandiser,S-7094-001,El Baraka 1,,12,11,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,,,,,,2,,,,,2,,2,,2,,,1,,,2,,,,,2,,1,,,,2,,,2,,,2
W43,10/22,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-7104-002,El Turke 2,4,8,2,,,1,,,,,,,,,3,,,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,1,,,,3,,,,,1,,,,,,,,,,,,,,,,,1,1,,,,
W44,10/25,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-7104-002,El Turke 2,4,8,2,,,1,,,,,,,,,3,,,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,1,,,,3,,,,,1,,,,,,,,,,,,,,,,,1,1,,,,
W44,10/29,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-7104-002,El Turke 2,,8,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,1,,,,3,,,,,1,,,,,,,,,,,,,,,,,,,,,,
W45,11/2,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-7104-002,El Turke 2,,8,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,1,,,,3,,,,,1,,,,,,,,,,,,,,,,,,,,,,
W45,11/5,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-7104-002,El Turke 2,,8,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,1,,,,3,,,,,1,,,,,,,,,,,,,,,,,,,,,,
W43,10/23,A-2115,Adel El Sayed Mohamed El Sayed,Merchandiser,S-7109-001,Makram,16,20,15,,3,1,,,,,,,,,,,,1,,,,,,,4,,2,5,,,,,,,,5,,,,2,,,,,,,,,,1,,7,2,,3,,,,,,3,,,,,,,,,,2,4,,,,,6
W43,10/24,A-2115,Adel El Sayed Mohamed El Sayed,Merchandiser,S-7109-001,Makram,13,29,19,,,,1,,,,,,,,,,3,,,,,,,,4,,,5,,,,,,,1,5,1,,,,,,,,1,1,,,,8,,7,2,,3,,,,1,,5,,,,,,,,,,2,4,1,,,,6
W44,10/25,A-2115,Adel El Sayed Mohamed El Sayed,Merchandiser,S-7109-001,Makram,,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
W45,11/5,A-2115,Adel El Sayed Mohamed El Sayed,Merchandiser,S-7109-001,Makram,19,28,18,,3,1,,,,,,,,,,,3,1,,,,,,,4,,2,5,,,,,,,1,5,,,,2,,,,,,,,,,8,,7,2,,3,,,,,,5,,,,,,,,,,2,4,1,,,,6
W45,11/6,A-2115,Adel El Sayed Mohamed El Sayed,Merchandiser,S-7109-001,Makram,19,28,18,,3,1,,,,,,,,,,,3,1,,,,,,,4,,2,5,,,,,,,1,5,,,,2,,,,,,,,,,8,,7,2,,3,,,,,,5,,,,,,,,,,2,4,1,,,,6
W44,10/25,A-2796,Ahmed Samy Abd El Aziz Abd El Ghany Khrwela,Merchandiser,S-7157-001,El Hamd,16,23,28,2,2,,,3,,,,,,,,,4,,,,,,,,,,,4,,1,,,,2,,3,,,,,,,,,,,,,,6,1,7,1,,2,,,1,,3,3,2,,,,,5,,,,3,3,1,2,,1,5
W44,10/29,A-2796,Ahmed Samy Abd El Aziz Abd El Ghany Khrwela,Merchandiser,S-7157-001,El Hamd,,23,28,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,3,,,,,,,,,,,,,,6,1,7,1,,2,,,1,,3,3,2,,,,,5,,,,3,3,1,2,,1,5
W45,11/4,A-2796,Ahmed Samy Abd El Aziz Abd El Ghany Khrwela,Merchandiser,S-7157-001,El Hamd,7,22,28,,2,,,2,,,,,,,,,3,,,,,,,,,,,,,,,,,2,,3,,,,,,,,,,,,,,5,1,7,1,,2,,,1,,3,3,2,,,,,5,,,,3,3,1,2,,1,5
W45,11/5,A-2796,Ahmed Samy Abd El Aziz Abd El Ghany Khrwela,Merchandiser,S-7157-001,El Hamd,10,22,28,3,2,,,2,,,,,,,,,3,,,,,,,,,,,,,,,,,2,,3,,,,,,,,,,,,,,5,1,7,1,,2,,,1,,3,3,2,,,,,5,,,,3,3,1,2,,1,5
W43,10/20,A-2796,Ahmed Samy Abd El Aziz Abd El Ghany Khrwela,Merchandiser,S-7218-001,Kemo,4,10,2,2,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,1,,,,,,,,,,,1,,,,,4,,4,,,,,,,,,,,,,,,,,,,1,1,,,,,
W44,10/27,A-2796,Ahmed Samy Abd El Aziz Abd El Ghany Khrwela,Merchandiser,S-7218-001,Kemo,4,10,2,2,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,1,,,,,,,,,,,1,,,,,4,,4,,,,,,,,,,,,,,,,,,,1,1,,,,,
W44,10/29,A-2796,Ahmed Samy Abd El Aziz Abd El Ghany Khrwela,Merchandiser,S-7218-001,Kemo,,10,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,,1,,,,,4,,4,,,,,,,,,,,,,,,,,,,1,1,,,,,
W45,11/4,A-2796,Ahmed Samy Abd El Aziz Abd El Ghany Khrwela,Merchandiser,S-7218-001,Kemo,,10,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,,1,,,,,4,,4,,,,,,,,,,,,,,,,,,,1,1,,,,,
W45,11/5,A-2796,Ahmed Samy Abd El Aziz Abd El Ghany Khrwela,Merchandiser,S-7218-001,Kemo,2,10,2,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,,1,,,,,4,,4,,,,,,,,,,,,,,,,,,,1,1,,,,,
W43,10/20,A-3357,Mohamed Ahmed Abd El Halem Soliman,Promoter,S-7253-001,Cairo For Sales (Heliopolis),,2,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,,,,,,,,,,,,,,,
W43,10/21,A-3357,Mohamed Ahmed Abd El Halem Soliman,Promoter,S-7253-001,Cairo For Sales (Heliopolis),,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
W43,10/22,A-3357,Mohamed Ahmed Abd El Halem Soliman,Promoter,S-7253-001,Cairo For Sales (Heliopolis),,2,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,,,,,,,,,,,,,,,
W43,10/23,A-3357,Mohamed Ahmed Abd El Halem Soliman,Promoter,S-7253-001,Cairo For Sales (Heliopolis),,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
W43,10/24,A-3357,Mohamed Ahmed Abd El Halem Soliman,Promoter,S-7253-001,Cairo For Sales (Heliopolis),,,7,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,7,,,,,,,,,,,,,,,,,,
W44,10/25,A-3357,Mohamed Ahmed Abd El Halem Soliman,Promoter,S-7253-001,Cairo For Sales (Heliopolis),,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
W44,10/26,A-3357,Mohamed Ahmed Abd El Halem Soliman,Promoter,S-7253-001,Cairo For Sales (Heliopolis),,2,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,,,,,,,,,,,,,,,
W44,10/27,A-3357,Mohamed Ahmed Abd El Halem Soliman,Promoter,S-7253-001,Cairo For Sales (Heliopolis),,6,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,6,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
W44,10/28,A-3357,Mohamed Ahmed Abd El Halem Soliman,Promoter,S-7253-001,Cairo For Sales (Heliopolis),,6,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,6,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,,,,,,,,,,,,,,,
W44,10/29,A-3357,Mohamed Ahmed Abd El Halem Soliman,Promoter,S-7253-001,Cairo For Sales (Heliopolis),,,7,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,7,,,,,,,,,,,,,,,,,,
W44,10/30,A-3357,Mohamed Ahmed Abd El Halem Soliman,Promoter,S-7253-001,Cairo For Sales (Heliopolis),,4,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,,,,,,,,,,,,,,,
W44,10/31,A-3357,Mohamed Ahmed Abd El Halem Soliman,Promoter,S-7253-001,Cairo For Sales (Heliopolis),,,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,,,,,,,,,,,,,,,
W45,11/1,A-3357,Mohamed Ahmed Abd El Halem Soliman,Promoter,S-7253-001,Cairo For Sales (Heliopolis),,6,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,6,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
W45,11/2,A-3357,Mohamed Ahmed Abd El Halem Soliman,Promoter,S-7253-001,Cairo For Sales (Heliopolis),,,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,,,,,,,,,,,,,,,
W45,11/3,A-3357,Mohamed Ahmed Abd El Halem Soliman,Promoter,S-7253-001,Cairo For Sales (Heliopolis),,2,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,,,,,,,,,,,,,,,
W45,11/4,A-3357,Mohamed Ahmed Abd El Halem Soliman,Promoter,S-7253-001,Cairo For Sales (Heliopolis),,,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,,,,,,,,,,,,,,,
W45,11/5,A-3357,Mohamed Ahmed Abd El Halem Soliman,Promoter,S-7253-001,Cairo For Sales (Heliopolis),,2,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,,,,,,,,,,,,,,,
W45,11/6,A-3357,Mohamed Ahmed Abd El Halem Soliman,Promoter,S-7253-001,Cairo For Sales (Heliopolis),,6,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,6,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,,,,,,,,,,,,,,,
W45,11/7,A-3357,Mohamed Ahmed Abd El Halem Soliman,Promoter,S-7253-001,Cairo For Sales (Heliopolis),,6,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,6,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,,,,,,,,,,,,,,,
W44,10/26,A-1605,Michael Magdy Kamal Khalil,Merchandiser,S-7515-001,El Sherif Center,10,6,7,6,,,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,,,3,1,,,,,,,3,,,,,,,,,,,,1,,,3
W44,10/29,A-1605,Michael Magdy Kamal Khalil,Merchandiser,S-7515-001,El Sherif Center,,6,7,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,,,3,1,,,,,,,3,,,,,,,,,,,,1,,,3
W45,11/2,A-1605,Michael Magdy Kamal Khalil,Merchandiser,S-7515-001,El Sherif Center,,6,7,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,,,3,1,,,,,,,3,,,,,,,,,,,,1,,,3
W45,11/5,A-1605,Michael Magdy Kamal Khalil,Merchandiser,S-7515-001,El Sherif Center,,6,7,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,,,3,1,,,,,,,3,,,,,,,,,,,,1,,,3
W43,10/23,A-1888,Ahmed Ali Ahmed Abd El Mageed Ramadan,Merchandiser,S-7530-001,El Serag,9,14,12,1,2,1,,,,1,,,,,,,1,,,,,,,,,,,1,,,2,,,,1,,,,1,1,,,,,,1,,,,2,,3,,3,,1,1,,,2,,1,,,,,,,,,2,2,,2,,1,2
W44,10/25,A-1888,Ahmed Ali Ahmed Abd El Mageed Ramadan,Merchandiser,S-7530-001,El Serag,10,15,12,1,2,1,,,,1,,,,,1,,1,,,,,,,,,,,1,,,2,,,,1,,,,1,1,,,,,,1,,,,2,,4,,3,,1,1,,,2,,1,,,,,,,,,2,2,,2,,1,2
W44,10/30,A-1888,Ahmed Ali Ahmed Abd El Mageed Ramadan,Merchandiser,S-7530-001,El Serag,1,15,12,,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,1,1,,,,,,1,,,,2,,4,,3,,1,1,,,2,,1,,,,,,,,,2,2,,2,,1,2
W45,11/4,A-1888,Ahmed Ali Ahmed Abd El Mageed Ramadan,Merchandiser,S-7530-001,El Serag,,16,12,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,1,2,,,,,,1,,,,2,,4,,3,,1,1,,,2,,1,,,,,,,,,2,2,,2,,1,2
W45,11/6,A-1888,Ahmed Ali Ahmed Abd El Mageed Ramadan,Merchandiser,S-7530-001,El Serag,,16,12,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,1,2,,,,,,1,,,,2,,4,,3,,1,1,,,2,,1,,,,,,,,,2,2,,2,,1,2
W44,10/26,A-3078,Afify Magdy Afify Afify,Merchandiser,S-7573-002,El Salhy (Mataria),11,10,6,2,4,,,,,,,,,,,2,,,,,,,,,2,1,,,,,,,,,,,1,,,,,,,,,,,,,4,,2,,3,,,,,,3,,,,,,,,,,,,,,2,,,1
W45,11/2,A-3078,Afify Magdy Afify Afify,Merchandiser,S-7573-002,El Salhy (Mataria),,7,3,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,1,,,,3,,2,,,,,,,,1,,,,,,,1,,,,,,,1,,,
W44,10/27,A-2483,Kareem Mohamed Shams El Deen Tawfik,Merchandiser,S-7576-001,Dewidar,5,3,2,4,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,1,,,,,,,,,,,,,,,,,,,,,,,1,1
W45,11/3,A-2483,Kareem Mohamed Shams El Deen Tawfik,Merchandiser,S-7576-001,Dewidar,,3,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,1,,,,,,,,,,,,,,,,,,,,,,,1,1
W43,10/21,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-7578-001,El Amin (Mansoura),4,12,10,1,1,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,2,,,2,,3,,2,,1,,,,1,,,,,,,,2,,,2,,,1,,4,
W44,10/25,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-7578-001,El Amin (Mansoura),4,12,10,1,1,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,2,,,2,,3,,2,,1,,,,1,,,,,,,,2,,,2,,,1,,4,
W44,10/28,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-7578-001,El Amin (Mansoura),4,13,10,1,1,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,,2,,,2,,3,,2,,1,,,,1,,,,,,,,2,,,2,,,1,,4,
W45,11/2,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-7578-001,El Amin (Mansoura),,13,10,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,,2,,,2,,3,,2,,1,,,,1,,,,,,,,2,,,2,,,1,,4,
W43,10/20,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-7611-001,El Walla (Mansoura),4,7,8,1,,3,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,3,,2,,1,,,,,,2,,,,,,,,2,,,2,1,,1,,,
W44,10/27,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-7611-001,El Walla (Mansoura),4,7,8,1,,3,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,3,,2,,1,,,,,,2,,,,,,,,2,,,2,1,,1,,,
W45,11/4,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-7611-001,El Walla (Mansoura),,7,8,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,3,,2,,1,,,,,,2,,,,,,,,2,,,2,1,,1,,,
W43,10/20,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-7650-001,El Belkasy,4,10,12,,1,3,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,2,,,,,,,,,,,,2,,2,,3,,,,,,2,,,,,,,2,1,,,2,3,,2,,,
W44,10/27,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-7650-001,El Belkasy,4,10,12,,1,3,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,2,,,,,,,,,,,,2,,2,,3,,,,,,2,,,,,,,2,1,,,2,3,,2,,,
W44,10/29,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-7650-001,El Belkasy,,10,12,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,2,,,,,,,,,,,,2,,2,,3,,,,,,2,,,,,,,2,1,,,2,3,,2,,,
W45,11/4,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-7650-001,El Belkasy,,10,12,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,2,,,,,,,,,,,,2,,2,,3,,,,,,2,,,,,,,2,1,,,2,3,,2,,,
W45,11/6,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-7650-001,El Belkasy,,10,12,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,2,,,,,,,,,,,,2,,2,,3,,,,,,2,,,,,,,2,1,,,2,3,,2,,,
W43,10/21,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-7692-001,Alzahra,4,12,8,1,,,,,,,,3,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,3,,3,,1,2,2,,,,2,,,,,,,,1,,,2,2,,,,1,
W44,10/25,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-7692-001,Alzahra,4,12,8,1,,,,,,,,3,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,3,,3,,1,2,2,,,,2,,,,,,,,1,,,2,2,,,,1,
W44,10/28,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-7692-001,Alzahra,4,12,8,1,,,,,,,,3,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,3,,3,,1,2,2,,,,2,,,,,,,,1,,,2,2,,,,1,
W45,11/2,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-7692-001,Alzahra,,12,8,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,3,,3,,1,2,2,,,,2,,,,,,,,1,,,2,2,,,,1,
W43,10/20,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-7705-001,El King (Ismalia),15,12,10,4,2,1,,3,,,,,,,,,3,,,,,,2,,,,,,,,,,,,,4,,,,,,,,,,,,3,,,,1,2,,,,,2,,,1,,,,,,,,,4,,2,1,,,,2
W43,10/22,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-7705-001,El King (Ismalia),15,12,10,4,2,1,,3,,,,,,,,,3,,,,,,2,,,,,,,,,,,,,4,,,,,,,,,,,,3,,,,1,2,,,,,2,,,1,,,,,,,,,4,,2,1,,,,2
W44,10/27,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-7705-001,El King (Ismalia),15,12,10,4,2,1,,3,,,,,,,,,3,,,,,,2,,,,,,,,,,,,,4,,,,,,,,,,,,3,,,,1,2,,,,,2,,,1,,,,,,,,,4,,2,1,,,,2
W44,10/29,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-7705-001,El King (Ismalia),,12,10,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,,,,,,,,,3,,,,1,2,,,,,2,,,1,,,,,,,,,4,,2,1,,,,2
W45,11/4,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-7705-001,El King (Ismalia),,12,10,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,,,,,,,,,3,,,,1,2,,,,,2,,,1,,,,,,,,,4,,2,1,,,,2
W43,10/21,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-7778-001,El Walaa,5,4,5,3,1,,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,3,,,,,,,,,,2,,,,,,,,,,2,,,,,1
W44,10/25,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-7778-001,El Walaa,3,9,3,2,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,,,,1,,,,1,,,,,,,2,,,1,,3,,1,,,,,,1,,,,,,,,,,,,2,,,,,
W44,10/28,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-7778-001,El Walaa,5,9,2,2,1,,1,,,,,,,,,,1,,,,,,,,,,,,,,,,,,,1,,,,1,,,,,,,2,,,1,,3,,1,,,,,,,,,,,,,,,,,,2,,,,,
W45,11/2,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-7778-001,El Walaa,,7,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,1,,3,,1,,,,,,,1,1,,,,,,,,,,2,,,,,
W43,10/22,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-7781-001,Felubater,3,7,1,,2,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,2,,,,,,,,,,2,,,,2,,,,,,,1,,,,,,,,,,,,,,,,
W44,10/25,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-7781-001,Felubater,3,6,,,2,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,2,,,,,,,1,,,,,,,2,,,,,,,,,,,,,,,,,,,,,,,
W44,10/29,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-7781-001,Felubater,,8,8,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,2,,,,,,,,,,2,,,,3,,,,,,3,2,,,,,,,,,,,,,2,,,1
W45,11/2,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-7781-001,Felubater,,5,6,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,2,,,,,,,,,,2,,,,,,,,,,3,2,,,,,,,,,,,,,1,,,
W45,11/5,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-7781-001,Felubater,,8,8,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,2,,,,,,,,,,2,,,,3,,,,,,3,2,,,,,,,,,,,,,2,,,1
W43,10/20,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-7783-001,El Amprator,3,4,3,1,,,1,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,2,,1,,,,,,,1,,,,,,,,,,,2,,,,,
W44,10/27,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-7783-001,El Amprator,3,5,1,,1,,,,,,,,,,,,1,,,,,,1,,,,,,,,,,,,,1,,,,,,,,,,,,,,1,,2,,1,,,,,,,1,,,,,,,,,,,,,,,,
W45,11/4,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-7783-001,El Amprator,,5,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,1,,2,,1,,,,,,,1,,,,,,,,,,,,,,,,
W44,10/26,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-7820-001,El Sharkawy 1 (El Menia ),4,6,2,,,,,2,,,,,,,,,,,,,,,,,,,,2,,,,,,,,3,,,,,,,,,,,,,,,,2,1,,,,,,,,2,,,,,,,,,,,,,,,,
W45,11/4,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-7820-001,El Sharkawy 1 (El Menia ),,5,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,,,,,,,2,,,,,,,,,2,,,,,,,,,,,,,,,,
W43,10/22,A-2303,Mahmoud Mustafa Mohamed Bawab,Trainner,S-7824-001,Awlad Mahmoud (Mina),2,4,2,,,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,1,,1,,,,,,,,,1,,,,,,1,,,,,,,,,,
W44,10/26,A-2303,Mahmoud Mustafa Mohamed Bawab,Trainner,S-7824-001,Awlad Mahmoud (Mina),2,5,1,,,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,2,,1,,,,,,,,,1,,,,,,,,,,,,,,,,
W44,10/29,A-2303,Mahmoud Mustafa Mohamed Bawab,Trainner,S-7824-001,Awlad Mahmoud (Mina),2,5,1,,,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,2,,1,,,,,,,,,1,,,,,,,,,,,,,,,,
W45,11/2,A-2303,Mahmoud Mustafa Mohamed Bawab,Trainner,S-7824-001,Awlad Mahmoud (Mina),2,5,1,,,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,2,,1,,,,,,,,,1,,,,,,,,,,,,,,,,
W45,11/5,A-2303,Mahmoud Mustafa Mohamed Bawab,Trainner,S-7824-001,Awlad Mahmoud (Mina),,5,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,2,,1,,,,,,,,,1,,,,,,,,,,,,,,,,1
W43,10/21,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-7825-001,El Wakeel,4,8,3,2,1,,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,2,,3,,,,,,,,,,,,,,,,,1,,,1,,,1
W44,10/25,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-7825-001,El Wakeel,6,9,3,2,1,,2,,,,,,,,,,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,3,,,,3,,,1,,,,,,,,,,,,,,,3,,,,,
W44,10/28,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-7825-001,El Wakeel,5,12,6,2,1,,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,3,,2,1,3,,,1,,,,,,,,,,,,,,1,3,,1,,,1
W45,11/2,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-7825-001,El Wakeel,,6,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,3,,,1,,,,,,,,,,,,,,,3,,,,,1
W45,11/6,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-7825-001,El Wakeel,2,9,6,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,2,,3,,,1,,,,,,,,,,,,,,1,3,,1,,,1
W43,10/21,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-7835-001,El Takwa (Beni Swief),4,4,3,,,,1,,,,,,,,,,,,,,,,,,,,,,,,3,,,1,,,,,1,,,,,,,,,,,1,,,,,,,1,,,,,1,,,,,,,,,1,,,,,,1
W44,10/25,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-7835-001,El Takwa (Beni Swief),6,3,2,3,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,,,,,,,1,,,1,,,,,,,1,,,,,,,,,,,,,,1,1,,,,,
W44,10/28,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-7835-001,El Takwa (Beni Swief),7,7,4,3,,,1,,,,,,,,,,,,,,,,,,,,,,,,3,,,1,,,1,,1,,,,,,,,1,,,1,,,,,,1,1,,,,,1,,,,,,,,,1,1,,,,,1
W45,11/2,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-7835-001,El Takwa (Beni Swief),,4,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,1,,,,,,,1,,,1,,,1,1,1,,,,,,,,,,1,,,,,
W43,10/20,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-7910-001,Ahmed Hosny,4,7,1,2,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,4,,,,,,,,,,3,,,,,,,,,,1,,,,,,,,,,,,,,,,,
W44,10/27,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-7910-001,Ahmed Hosny,6,4,2,1,,,,,,,,,,,,,1,,,,,,,,1,,,3,,,,,,,,,,,,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,
W44,10/30,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-7910-001,Ahmed Hosny,,10,6,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,,,,,,,3,,3,,,,,,,,,,,2,,,,,,,,2,2,,,,,
W45,11/4,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-7910-001,Ahmed Hosny,,9,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,,,,,,,3,,2,,,,,,,,,,,,,,,,,,,2,,,,,,
W45,11/6,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-7910-001,Ahmed Hosny,,9,8,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,,,,,,,3,,2,,,,,,,,1,,,2,,,,,,,,2,2,,,,,1
W43,10/20,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-7920-001,El Takwa (Minya),10,5,2,,,,,,,,2,,,,,,5,,,,,,,,,,,3,,,,,,,,3,,,,,,,,,,,,,,,,1,1,,,,,,,,,,,,,,2,,,,,,,,,,
W43,10/23,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-7920-001,El Takwa (Minya),10,5,2,,,,,,,,2,,,,,,5,,,,,,,,,,,3,,,,,,,,3,,,,,,,,,,,,,,,,1,1,,,,,,,,,,,,,,2,,,,,,,,,,
W44,10/27,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-7920-001,El Takwa (Minya),10,4,2,,,,,,,,2,,,,,,5,,,,,,,,,,,3,,,,,,,,3,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,2,,,,,,,,,,
W44,10/30,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-7920-001,El Takwa (Minya),,4,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,2,,,,,,,,,,
W45,11/3,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-7920-001,El Takwa (Minya),,4,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,2,,,,,,,,,,
W44,10/25,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-7933-001,Gabra Fawzy Gabra,14,13,7,2,2,,,3,,,,,,,1,,2,,,,,,3,,,,,1,,,,,,,,4,,,,,,,,,,,,2,,,,,3,,2,,,2,,,1,,,,,,,,,5,,,,,,,1
W45,11/2,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-7933-001,Gabra Fawzy Gabra,,13,7,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,,,,,,,,,2,,,,,3,,2,,,2,,,1,,,,,,,,,5,,,,,,,1
W44,10/26,A-2483,Kareem Mohamed Shams El Deen Tawfik,Merchandiser,S-8007-001,Seyam,11,5,4,4,3,,,,,,,,,,,,,,,,,,,,,,,2,2,,,,,,,3,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,,1,,,,,,,,,1,2
W45,11/2,A-2483,Kareem Mohamed Shams El Deen Tawfik,Merchandiser,S-8007-001,Seyam,,5,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,,1,,,,,,,,,1,2
W43,10/20,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-8011-001,Hassan Hassan Abdel Wahab,28,28,21,6,7,2,3,2,,,,,,,,,3,,,,,,3,,,,,2,,,,,,1,,4,3,,,2,,,,,,,,3,,2,,3,3,,,2,3,2,2,1,1,,2,,,,,,,6,,2,2,,,3,2
W43,10/22,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-8011-001,Hassan Hassan Abdel Wahab,28,28,21,6,7,2,3,2,,,,,,,,,3,,,,,,3,,,,,2,,,,,,1,,4,3,,,2,,,,,,,,3,,2,,3,3,,,2,3,2,2,1,1,,2,,,,,,,6,,2,2,,,3,2
W44,10/27,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-8011-001,Hassan Hassan Abdel Wahab,28,28,21,6,7,2,3,2,,,,,,,,,3,,,,,,3,,,,,2,,,,,,1,,4,3,,,2,,,,,,,,3,,2,,3,3,,,2,3,2,2,1,1,,2,,,,,,,6,,2,2,,,3,2
W44,10/29,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-8011-001,Hassan Hassan Abdel Wahab,,28,21,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,4,3,,,2,,,,,,,,3,,2,,3,3,,,2,3,2,2,1,1,,2,,,,,,,6,,2,2,,,3,2
W45,11/4,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-8011-001,Hassan Hassan Abdel Wahab,,28,21,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,4,3,,,2,,,,,,,,3,,2,,3,3,,,2,3,2,2,1,1,,2,,,,,,,6,,2,2,,,3,2
W43,10/21,A-3078,Afify Magdy Afify Afify,Merchandiser,S-8068-001,Mohamed Taher Shop (Dakrns),15,6,3,2,,,,,3,,,,,,,,2,,2,,3,,,,1,,,2,,,,,,,1,,,,,2,,,,,,,,,,2,,1,,,,,,,,1,,,1,,,,,,,,1,,,,,,
W44,10/25,A-3078,Afify Magdy Afify Afify,Merchandiser,S-8068-001,Mohamed Taher Shop (Dakrns),15,6,3,2,,,,,3,,,,,,,,2,,2,,3,,,,1,,,2,,,,,,,1,,,,,2,,,,,,,,,,2,,1,,,,,,,,1,,,1,,,,,,,,1,,,,,,
W44,10/28,A-3078,Afify Magdy Afify Afify,Merchandiser,S-8068-001,Mohamed Taher Shop (Dakrns),15,6,3,2,1,,,,3,,,,,,,,3,,,,3,,,,1,,,2,,,,,,,1,,,,,2,,,,,,,,,,2,,1,,,,,,,,1,,,1,,,,,,,,1,,,,,,
W45,11/4,A-3078,Afify Magdy Afify Afify,Merchandiser,S-8068-001,Mohamed Taher Shop (Dakrns),,3,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,1,,,,,,,1,,,,,,,,,,,,,,,,,,,,,,,,,
W43,10/22,A-2303,Mahmoud Mustafa Mohamed Bawab,Trainner,S-8166-001,El Sabereen,2,5,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,5,,,,,,,,,,,,,,,,,,,,,,,,,
W44,10/26,A-2303,Mahmoud Mustafa Mohamed Bawab,Trainner,S-8166-001,El Sabereen,,5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,5,,,,,,,,,,,,,,,,,,,,,,,,,
W44,10/26,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-8285-001,Awlad El Desouky,3,12,8,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,,,,1,,,,,,,,,,,,,,2,2,,3,,1,3,,,,,2,,,,,,,,1,,,2,2,,1,,,
W45,11/3,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-8285-001,Awlad El Desouky,,12,8,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,2,2,,3,,1,3,,,,,2,,,,,,,,1,,,2,2,,1,,,
W44,10/26,A-3078,Afify Magdy Afify Afify,Merchandiser,S-8313-001,Ahmed Elfar,6,18,24,,3,,,,,,,,,,,,1,,,,,,,,,,,2,,,,,,,,,,,,,,,,,,1,,,,8,,6,,,2,,1,,,5,,,,,,,2,,,,5,7,2,,,,3
W45,11/2,A-3078,Afify Magdy Afify Afify,Merchandiser,S-8313-001,Ahmed Elfar,,10,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,6,,3,,,1,,,,,,,,,,,,,,,,,,,,,,1
W44,10/25,A-2303,Mahmoud Mustafa Mohamed Bawab,Trainner,S-8367-001,Abo Zaghrot 2,4,8,2,1,,,,,,,,,,,,,,,,,2,,,,1,,,,,,,,,,,2,,,,,,,,,,,,,,3,,3,,,,,,,,,,,,,,,,,,,1,,1,,,,
W45,11/4,A-2303,Mahmoud Mustafa Mohamed Bawab,Trainner,S-8367-001,Abo Zaghrot 2,,8,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,3,,3,,,,,,,,,,,,,,,,,,,1,,1,,,,
W43,10/20,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-8390-001,El Araby,4,4,,1,1,,,,,,,,,,1,,,,,,,,1,,,,,,,,,,,,,1,,,,,,,,,,,,,,1,,2,,,,,,,,,,,,,,,,,,,,,,,,,
W44,10/27,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-8390-001,El Araby,3,5,3,1,,,1,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,1,,,,,,,,,,,,,,1,,2,,,1,,,,,,,,,,,,,,,,,3,,,,,
W45,11/4,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-8390-001,El Araby,,3,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,1,,,,,,1,,,,,,,,,,,3,,,,,
W44,10/27,A-1265,Hossam Mohamed Zaki Hegazy,Merchandiser,S-8565-001,Maarad Fadel,1,17,4,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,5,,,,,,,,,,3,1,,,1,,4,,3,,,,,,,,,,,,,,,,,,1,,3,,,
W45,11/2,A-1265,Hossam Mohamed Zaki Hegazy,Merchandiser,S-8565-001,Maarad Fadel,,7,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,4,,,,,,,,,,,,,,,,,,3,,,,,,,,,,,,,,,,,,1,,1,,,
W44,10/27,A-2483,Kareem Mohamed Shams El Deen Tawfik,Merchandiser,S-8635-001,Mabrook El Dawlia,7,4,2,3,2,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,,,,,,,2,,1,1,,,,,,,,,,,,,,,,,,,,,,,1,1
W45,11/3,A-2483,Kareem Mohamed Shams El Deen Tawfik,Merchandiser,S-8635-001,Mabrook El Dawlia,,4,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,1,1,,,,,,,,,,,,,,,,,,,,,,,1,1
W43,10/21,A-3179,Mohamed Sayed El Metwaly Mohamed,Merchandiser,S-8673-001,El Harmen,3,2,2,,2,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,1,,,,,,,,,,,,,,,1,,,,,,,,,,2,,,,,,,,,,,,,,,,,
W44,10/25,A-3179,Mohamed Sayed El Metwaly Mohamed,Merchandiser,S-8673-001,El Harmen,3,2,3,,2,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,3,,,,,,,,,,,,,,,,,
W44,10/28,A-3179,Mohamed Sayed El Metwaly Mohamed,Merchandiser,S-8673-001,El Harmen,3,3,3,,2,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,1,,,,,,,,,,,,,,,2,,,,,,,,,,3,,,,,,,,,,,,,,,,,
W45,11/4,A-3179,Mohamed Sayed El Metwaly Mohamed,Merchandiser,S-8673-001,El Harmen,,2,3,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,3,,,,,,,,,,,,,,,,,
W43,10/20,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-8681-001,Awlad Medhat,5,11,1,,,,,2,,,,,,,2,,,,,,,,,,,,,1,,,,,,,,3,,,,,,,,,,2,,,,1,,,1,2,2,,,,,,,,,,,,,,,,,,,,,,1
W43,10/23,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-8681-001,Awlad Medhat,4,11,1,,,,,2,,,,,,,1,,,,,,,,,,,,,1,,,,,,,,3,,,,,,,,,,2,,,,1,,,1,2,2,,,,,,,,,,,,,,,,,,,,,,1
W44,10/26,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-8681-001,Awlad Medhat,4,10,1,,,,,2,,,,,,,1,,,,,,,,,,,,,1,,,,,,,,2,,,,,,,,,,2,,,,1,,,1,2,2,,,,,,,,,,,,,,,,,,,,,,1
W44,10/27,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-8681-001,Awlad Medhat,4,10,1,,,,,2,,,,,,,1,,,,,,,,,,,,,1,,,,,,,,2,,,,,,,,,,2,,,,1,,,1,2,2,,,,,,,,,,,,,,,,,,,,,,1
W44,10/29,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-8681-001,Awlad Medhat,,10,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,2,,,,1,,,1,2,2,,,,,,,,,,,,,,,,,,,,,,
W44,10/30,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-8681-001,Awlad Medhat,,10,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,2,,,,1,,,1,2,2,,,,,,,,,,,,,,,,,,,,,,
W45,11/2,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-8681-001,Awlad Medhat,,9,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,2,,,,1,,,1,1,2,,,,,,,,,,,,,,,,,,,,,,
W45,11/4,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-8681-001,Awlad Medhat,,10,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,2,,,,2,,,1,1,2,,,,,,,,,,,,,,,,,,,,,,
W43,10/22,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-8682-001,Bolbol,9,6,,,,,,1,,,2,,,,2,,2,,,,,,,,,,,2,,,,,,,,2,1,,,,,,,,,,,,,1,,2,,,,,,,,,,,,,,,,,,,,,,,,,
W44,10/25,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-8682-001,Bolbol,9,6,,,,,,1,,,2,,,,2,,2,,,,,,,,,,,2,,,,,,,,2,1,,,,,,,,,,,,,1,,2,,,,,,,,,,,,,,,,,,,,,,,,,
W44,10/29,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-8682-001,Bolbol,,6,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,1,,,,,,,,,,,,,1,,2,,,,,,,,,,,,,,,,,,,,,,,,,
W45,11/2,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-8682-001,Bolbol,,6,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,1,,,,,,,,,,,,,1,,2,,,,,,,,,,,,,,,,,,,,,,,,,
W45,11/5,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-8682-001,Bolbol,,6,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,1,,,,,,,,,,,,,1,,2,,,,,,,,,,,,,,,,,,,,,,,,,
W43,10/21,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-8683-001,Hanna Nasr,4,3,2,,,,,2,,,,,2,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,1,,,,1,,,,,,,,,,,,,,,1,,,,,,,,,,,1,,,,,
W43,10/22,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-8683-001,Hanna Nasr,3,3,2,,,,,2,,,,,1,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,1,,,,1,,,,,,,,,,,,,,,1,,,,,,,,,,,1,,,,,
W44,10/25,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-8683-001,Hanna Nasr,3,3,2,,,,,2,,,,,1,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,1,,,,1,,,,,,,,,,,,,,,1,,,,,,,,,,,1,,,,,
W45,11/3,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-8683-001,Hanna Nasr,,3,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,1,,,,1,,,,,,,,,,,,,,,1,,,,,,,,,,,1,,,,,
W45,11/5,A-1835,Ahmed Mohamed Magdy Taha,Supervisor,S-8683-001,Hanna Nasr,,3,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,1,,,,1,,,,,,,,,,,,,,,1,,,,,,,,,,,1,,,,,
W43,10/21,A-3096,Yasser Omar Abd El Hakem Hamoda,Promoter,S-8829-003,Lulu (N90 Park Mall),55,25,22,26,4,,4,,,,,,,,,,,,,,,,7,,4,,,10,,,,,,3,1,4,2,,,,,,,,,,,7,,4,,1,2,,,,,1,5,,,,,,,,,,,12,1,4,,,,,
W43,10/22,A-3096,Yasser Omar Abd El Hakem Hamoda,Promoter,S-8829-003,Lulu (N90 Park Mall),55,25,22,26,4,,4,,,,,,,,,,,,,,,,7,,4,,,10,,,,,,3,1,4,2,,,,,,,,,,,7,,4,,1,2,,,,,1,5,,,,,,,,,,,12,1,4,,,,,
W43,10/23,A-3096,Yasser Omar Abd El Hakem Hamoda,Promoter,S-8829-003,Lulu (N90 Park Mall),55,25,22,26,4,,4,,,,,,,,,,,,,,,,7,,4,,,10,,,,,,3,1,4,2,,,,,,,,,,,7,,4,,1,2,,,,,1,5,,,,,,,,,,,12,1,4,,,,,
W43,10/24,A-3096,Yasser Omar Abd El Hakem Hamoda,Promoter,S-8829-003,Lulu (N90 Park Mall),55,25,22,26,4,,4,,,,,,,,,,,,,,,,7,,4,,,10,,,,,,3,1,4,2,,,,,,,,,,,7,,4,,1,2,,,,,1,5,,,,,,,,,,,12,1,4,,,,,
W44,10/25,A-3096,Yasser Omar Abd El Hakem Hamoda,Promoter,S-8829-003,Lulu (N90 Park Mall),55,25,22,26,4,,4,,,,,,,,,,,,,,,,7,,4,,,10,,,,,,3,1,4,2,,,,,,,,,,,7,,4,,1,2,,,,,1,5,,,,,,,,,,,12,1,4,,,,,
W44,10/27,A-3096,Yasser Omar Abd El Hakem Hamoda,Promoter,S-8829-003,Lulu (N90 Park Mall),55,25,22,26,4,,4,,,,,,,,,,,,,,,,7,,4,,,10,,,,,,3,1,4,2,,,,,,,,,,,7,,4,,1,2,,,,,1,5,,,,,,,,,,,12,1,4,,,,,
W44,10/28,A-3096,Yasser Omar Abd El Hakem Hamoda,Promoter,S-8829-003,Lulu (N90 Park Mall),55,25,22,26,4,,4,,,,,,,,,,,,,,,,7,,4,,,10,,,,,,3,1,4,2,,,,,,,,,,,7,,4,,1,2,,,,,1,5,,,,,,,,,,,12,1,4,,,,,
W44,10/30,A-3096,Yasser Omar Abd El Hakem Hamoda,Promoter,S-8829-003,Lulu (N90 Park Mall),56,25,22,27,4,,4,,,,,,,,,,,,,,,,7,,4,,,10,,,,,,3,1,4,2,,,,,,,,,,,7,,4,,1,2,,,,,1,5,,,,,,,,,,,12,1,4,,,,,
W44,10/31,A-3096,Yasser Omar Abd El Hakem Hamoda,Promoter,S-8829-003,Lulu (N90 Park Mall),56,25,22,27,4,,4,,,,,,,,,,,,,,,,7,,4,,,10,,,,,,3,1,4,2,,,,,,,,,,,7,,4,,1,2,,,,,1,5,,,,,,,,,,,12,1,4,,,,,
W45,11/3,A-3096,Yasser Omar Abd El Hakem Hamoda,Promoter,S-8829-003,Lulu (N90 Park Mall),58,25,22,29,4,,4,,,,,,,,,,,,,,,,7,,4,,,10,,,,,,3,1,4,2,,,,,,,,,,,7,,4,,1,2,,,,,1,5,,,,,,,,,,,12,1,4,,,,,
W45,11/4,A-3096,Yasser Omar Abd El Hakem Hamoda,Promoter,S-8829-003,Lulu (N90 Park Mall),58,25,22,29,4,,4,,,,,,,,,,,,,,,,7,,4,,,10,,,,,,3,1,4,2,,,,,,,,,,,7,,4,,1,2,,,,,1,5,,,,,,,,,,,12,1,4,,,,,
W45,11/5,A-3096,Yasser Omar Abd El Hakem Hamoda,Promoter,S-8829-003,Lulu (N90 Park Mall),58,25,22,29,4,,4,,,,,,,,,,,,,,,,7,,4,,,10,,,,,,3,1,4,2,,,,,,,,,,,7,,4,,1,2,,,,,1,5,,,,,,,,,,,12,1,4,,,,,
W45,11/6,A-3096,Yasser Omar Abd El Hakem Hamoda,Promoter,S-8829-003,Lulu (N90 Park Mall),29,,,29,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
W45,11/7,A-3096,Yasser Omar Abd El Hakem Hamoda,Promoter,S-8829-003,Lulu (N90 Park Mall),47,7,,29,4,,,,,,,,,,,,,,,,,,,,4,,,10,,,,,,,1,,,,,,,,,,,,,,,4,,,2,,,,,,,,,,,,,,,,,,,,,,,,
W44,10/26,A-1888,Ahmed Ali Ahmed Abd El Mageed Ramadan,Merchandiser,S-8847-001,Markaz Mousa,6,11,6,1,,1,,,,1,,,,,1,,1,,,,,,,,,,,,,,1,,,1,1,2,,,1,,,,,,,1,,,,1,,2,,2,,,,,,,,,,,,,,,,,1,1,1,1,,,2
W44,10/29,A-1888,Ahmed Ali Ahmed Abd El Mageed Ramadan,Merchandiser,S-8847-001,Markaz Mousa,,11,6,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,1,2,,,1,,,,,,,1,,,,1,,2,,2,,,,,,,,,,,,,,,,,1,1,1,1,,,2
W45,11/2,A-1888,Ahmed Ali Ahmed Abd El Mageed Ramadan,Merchandiser,S-8847-001,Markaz Mousa,,11,6,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,1,2,,,1,,,,,,,1,,,,1,,2,,2,,,,,,,,,,,,,,,,,1,1,1,1,,,2
W44,10/26,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-8850-001,Gaber Darwish,19,13,5,3,4,3,,3,,,,,,,,,3,,,,,,3,,,,,,,,,,,,,3,,,,1,,,,,,,,3,,,,1,2,,3,,,,,,,,,,,,,,,5,,,,,,,
W45,11/3,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-8850-001,Gaber Darwish,,13,5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,1,,,,,,,,3,,,,1,2,,3,,,,,,,,,,,,,,,5,,,,,,,
W44,10/25,A-2303,Mahmoud Mustafa Mohamed Bawab,Trainner,S-8854-001,Maarad Awlad El Shaikh,4,11,5,,,2,,,,,,,,,,,2,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,2,,,,2,,3,1,,,,,,1,,1,,,,,,,,,,,,3,,,,
W45,11/4,A-2303,Mahmoud Mustafa Mohamed Bawab,Trainner,S-8854-001,Maarad Awlad El Shaikh,,11,5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,2,,,,2,,3,1,,,,,,1,,1,,,,,,,,,,,,3,,,,
W44,10/26,A-2483,Kareem Mohamed Shams El Deen Tawfik,Merchandiser,S-8887-001,El-Haram (Faraskour),3,2,2,2,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,,1,,,,,,,,,,1
W45,11/2,A-2483,Kareem Mohamed Shams El Deen Tawfik,Merchandiser,S-8887-001,El-Haram (Faraskour),,2,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,,1,,,,,,,,,,1
W44,10/26,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-8908-001,El Behery Center,20,11,11,4,2,2,,3,,,,,,,1,,3,,,,,,5,,,,,,,,,,,,,,,,,1,,,,,,,,3,,1,,1,3,,2,,,,,,1,,,,,,,,,7,,,1,,1,,1
W45,11/3,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-8908-001,El Behery Center,,11,11,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,3,,1,,1,3,,2,,,,,,1,,,,,,,,,7,,,1,,1,,1
W44,10/25,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-8968-001,El Tawaam,11,16,7,2,,,,,,,,,,,2,,,,,,,,,,4,,,3,,,,,,,1,1,,,,1,,,,,,,,,,4,,7,,,,,2,,,2,,,,,,,3,,,,,2,,,,,
W45,11/4,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-8968-001,El Tawaam,,18,7,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,2,,,,1,,,,,,,,,,4,,7,,,1,,2,,,2,,,,,,,3,,,,,2,,,,,
W43,10/20,A-1888,Ahmed Ali Ahmed Abd El Mageed Ramadan,Merchandiser,S-8994-001,Moasaset Abo Eita,5,9,2,,,1,,,,,,,,,1,,1,,,,1,,,,,,,1,,,,,,,1,,,1,,,,1,,,,,,,,,,2,1,1,,,2,,,,,,,,,,,,,,,1,,1,,,
W44,10/27,A-1888,Ahmed Ali Ahmed Abd El Mageed Ramadan,Merchandiser,S-8994-001,Moasaset Abo Eita,5,9,2,,,1,,,,,,,,,1,,1,,,,1,,,,,,,1,,,,,,,1,,,1,,,,1,,,,,,,,,,2,1,1,,,2,,,,,,,,,,,,,,,1,,1,,,
W45,11/3,A-1888,Ahmed Ali Ahmed Abd El Mageed Ramadan,Merchandiser,S-8994-001,Moasaset Abo Eita,,11,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,1,,,,1,,,,1,,,1,,,2,1,1,,,2,,,,,,,,,,,,,,,1,,1,,,2
W43,10/21,A-1888,Ahmed Ali Ahmed Abd El Mageed Ramadan,Merchandiser,S-9035-001,Awlad Awad El Embaby,7,12,6,,1,1,,1,,2,,,,,,,1,,,,,,,,,,,,,,1,,,,1,1,,1,,1,,,,,,1,,,,1,,2,1,3,,,,,1,,,1,,,,,,,,,1,1,,1,,,1
W44,10/25,A-1888,Ahmed Ali Ahmed Abd El Mageed Ramadan,Merchandiser,S-9035-001,Awlad Awad El Embaby,7,12,6,,,1,,1,,2,,,,,,,1,,,,1,,,,,,,,,,1,,,,1,1,,1,,1,,,,,,1,,,,1,,2,1,3,,,,,1,,,1,,,,,,,,,1,1,,1,,,1
W44,10/28,A-1888,Ahmed Ali Ahmed Abd El Mageed Ramadan,Merchandiser,S-9035-001,Awlad Awad El Embaby,7,12,6,,,1,,1,,2,,,,,,,1,,,,1,,,,,,,,,,1,,,,1,1,,1,,1,,,,,,1,,,,1,,2,1,3,,,,,1,,,1,,,,,,,,,1,1,,1,,,1
W45,11/4,A-1888,Ahmed Ali Ahmed Abd El Mageed Ramadan,Merchandiser,S-9035-001,Awlad Awad El Embaby,,13,6,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,1,,1,,1,,,,,,1,,,,1,,2,1,3,,,1,,1,,,1,,,,,,,,,1,1,,1,,,1
W44,10/26,A-1888,Ahmed Ali Ahmed Abd El Mageed Ramadan,Merchandiser,S-9036-001,El Madina El Monawara (Senblaween),5,11,9,,1,3,,1,,,,,,,,,,,,,,,,,,,,,,,,,,,1,1,,1,,1,,,,,,,,,,1,,2,,3,,1,,,,1,,1,,,,,,,,,1,2,1,1,,,2
W45,11/2,A-1888,Ahmed Ali Ahmed Abd El Mageed Ramadan,Merchandiser,S-9036-001,El Madina El Monawara (Senblaween),,11,9,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,1,,,,1,,,,,,1,,,1,1,,2,,3,,,,,,2,,1,,,,,,,1,,1,1,,1,,,2
W43,10/20,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-9100-001,Maarad El Tokhy,19,15,7,4,6,2,,2,,,,,,,,,3,,,,,,2,,,,,,,,,,,,,3,,,,,,,,,,,,4,,2,,1,5,,,,,,,,,,,,,,,,,5,,1,1,,,,
W44,10/27,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-9100-001,Maarad El Tokhy,19,15,7,4,6,2,,2,,,,,,,,,3,,,,,,2,,,,,,,,,,,,,3,,,,,,,,,,,,4,,2,,1,5,,,,,,,,,,,,,,,,,5,,1,1,,,,
W45,11/4,A-1382,Ahmed Fathy Ahmed Abd El Mageed,Merchandiser,S-9100-001,Maarad El Tokhy,,15,7,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,3,,,,,,,,,,,,4,,2,,1,5,,,,,,,,,,,,,,,,,5,,1,1,,,,
W43,10/20,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-9119-001,Adelko 2,2,9,6,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,2,,,,,,,,,,,,,,2,,4,,,,,,,,,1,,,,,,,,,,1,2,,,,,2
W45,11/4,A-2087,Ahmed Alaa El Deen Ahmed Abd El Aziz,Merchandiser,S-9119-001,Adelko 2,,7,6,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,2,,,,,,,,,,,,,,,,4,,,,,,,,,1,,,,,,,,,,1,2,,,,,2
W44,10/26,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-9133-001,Edy Star,3,6,8,1,,,,,,,,,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,3,,1,,,,,,2,,,,,,,,1,,,2,2,,1,,,
W45,11/3,A-1862,Eslam Mahmoud Akl Ali Atta Allah,Merchandiser,S-9133-001,Edy Star,,7,8,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,3,,2,,,,,,2,,,,,,,,1,,,2,2,,1,,,
W43,10/21,A-3387,Ahmed Magdy El Saeed El Nady,Promoter,S-9158-005,Raneen (Shoubra El Kheima),5,,,5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
W43,10/22,A-3387,Ahmed Magdy El Saeed El Nady,Promoter,S-9158-005,Raneen (Shoubra El Kheima),5,,,5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
W43,10/24,A-3387,Ahmed Magdy El Saeed El Nady,Promoter,S-9158-005,Raneen (Shoubra El Kheima),5,,,5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
W44,10/30,A-3387,Ahmed Magdy El Saeed El Nady,Promoter,S-9158-005,Raneen (Shoubra El Kheima),,1,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,,,
W44,10/31,A-3387,Ahmed Magdy El Saeed El Nady,Promoter,S-9158-005,Raneen (Shoubra El Kheima),,1,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,,,
W45,11/2,A-3387,Ahmed Magdy El Saeed El Nady,Promoter,S-9158-005,Raneen (Shoubra El Kheima),,1,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,,,
W45,11/4,A-3387,Ahmed Magdy El Saeed El Nady,Promoter,S-9158-005,Raneen (Shoubra El Kheima),5,1,1,5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,,,
W43,10/20,A-2483,Kareem Mohamed Shams El Deen Tawfik,Merchandiser,S-9161-001,Mohamed Zaghmour,7,2,2,5,1,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,,,,,,,,,,,1,1
W43,10/23,A-2483,Kareem Mohamed Shams El Deen Tawfik,Merchandiser,S-9161-001,Mohamed Zaghmour,7,2,2,5,1,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,,,,,,,,,,,1,1
W44,10/26,A-2483,Kareem Mohamed Shams El Deen Tawfik,Merchandiser,S-9161-001,Mohamed Zaghmour,7,2,2,5,1,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,,,,,,,,,,,1,1
W44,10/28,A-2483,Kareem Mohamed Shams El Deen Tawfik,Merchandiser,S-9161-001,Mohamed Zaghmour,7,2,2,5,1,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,,,,,,,,,,,1,1
W45,11/4,A-2483,Kareem Mohamed Shams El Deen Tawfik,Merchandiser,S-9161-001,Mohamed Zaghmour,,2,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,,,,,,,,,,,1,1
W45,11/5,A-2483,Kareem Mohamed Shams El Deen Tawfik,Merchandiser,S-9161-001,Mohamed Zaghmour,,2,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,2,,,,,,,,,,,,,,,,,,,,,,,,,,1,1
W43,10/20,A-3179,Mohamed Sayed El Metwaly Mohamed,Merchandiser,S-9262-001,El Basha (Fayoum),,5,2,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,2,,2,,,,,,,,,,1,,,,,,,,,,1,,,,,
W43,10/22,A-3179,Mohamed Sayed El Metwaly Mohamed,Merchandiser,S-9262-001,El Basha (Fayoum),2,3,,,1,,,,,,,,,,,,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,2,,,,,,,,,,,,,,,,,,,,,,,,,
W44,10/27,A-3179,Mohamed Sayed El Metwaly Mohamed,Merchandiser,S-9262-001,El Basha (Fayoum),1,5,3,,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,1,,,,,,,,,,1,,2,,,,,,,,,,1,,,,,,,,,1,1,,,,,
W45,11/3,A-3179,Mohamed Sayed El Metwaly Mohamed,Merchandiser,S-9262-001,El Basha (Fayoum),,1,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,1143,443,159,105,111,9,14,28,9,10,20,38,2,167,3,4,1,26,6,194,4,110,1,6,238,6,1,17,2,6,210,71,493,67,18,10,158,13,21,0,0,17,87,43,196,15,477,4,452,213,246,129,49,83,66,297,181,114,76,17,14,4,1,68,57,1,324,149,305,70,129,7,83,229`;;

// CSV PARSER — extracts AV, REF, WM from cols 7,8,9
function parseRawData(csv) {
  const lines = csv.trim().split('\n');
  const rows = lines.slice(1).map(line => line.split(','));
  return rows
    .filter(row => row.length > 9 && row[0].startsWith('W'))
    .map(row => ({
      week: row[0],
      day: row[1],
      empCode: row[2],
      empName: row[3],
      title: row[4],
      shopCode: row[5],
      shopName: row[6],
      av: row[7] === '' ? null : Number(row[7]),
      ref: row[8] === '' ? null : Number(row[8]),
      wm: row[9] === '' ? null : Number(row[9]),
      fullDate: new Date(`2025-${row[1].replace('/', '-')}`) // assumes 2025
    }));
}

const rawData = parseRawData(csvContent);

// FRAUD ANALYSIS ENGINE
const useFraudAnalysis = (data) => {
  return useMemo(() => {
    const results = {
      impossibleVisits: [],      // Same day, >1 shop
      duplicatePatterns: [],     // Identical (av,ref,wm) ≥3 times per shop
      missingDataPatterns: [],   // Strategic AV omission
      statisticalOutliers: [],   // AV far from mean
      tooConsistent: [],         // Zero variance in AV across visits
      geographicFlags: []        // Not implemented (needs lat/long)
    };

    // 1. IMPOSSIBLE VISITS: same day, multiple shops
    const visitsByEmpDay = {};
    data.forEach(r => {
      const key = `${r.empCode}-${r.day}`;
      if (!visitsByEmpDay[key]) visitsByEmpDay[key] = [];
      visitsByEmpDay[key].push(r);
    });
    Object.values(visitsByEmpDay).forEach(visits => {
      if (visits.length > 1 && new Set(visits.map(v => v.shopCode)).size > 1) {
        results.impossibleVisits.push({
          empCode: visits[0].empCode,
          empName: visits[0].empName,
          day: visits[0].day,
          shopCount: new Set(visits.map(v => v.shopCode)).size,
          severity: 'CRITICAL'
        });
      }
    });

    // 2. DUPLICATE PATTERNS (copy-paste)
    const shopVisitGroups = {};
    data.forEach(r => {
      const key = `${r.empCode}-${r.shopCode}`;
      if (!shopVisitGroups[key]) shopVisitGroups[key] = [];
      if (r.av !== null) shopVisitGroups[key].push(r);
    });
    Object.entries(shopVisitGroups).forEach(([key, visits]) => {
      if (visits.length >= 3) {
        const sigs = visits.map(v => `${v.av}-${v.ref}-${v.wm}`);
        const uniqueSigs = new Set(sigs);
        if (uniqueSigs.size === 1 && sigs[0] !== 'null-null-null') {
          results.duplicatePatterns.push({
            empCode: visits[0].empCode,
            empName: visits[0].empName,
            shopName: visits[0].shopName,
            pattern: sigs[0],
            count: visits.length,
            severity: 'HIGH'
          });
        }
      }
    });

    // 3. STRATEGIC MISSING DATA (AV null while REF/WM present)
    const missingPatterns = {};
    data.forEach(r => {
      if (!missingPatterns[r.empCode]) {
        missingPatterns[r.empCode] = { name: r.empName, total: 0, avMissing: 0 };
      }
      const rec = missingPatterns[r.empCode];
      rec.total++;
      if (r.av === null && (r.ref !== null || r.wm !== null)) rec.avMissing++;
    });
    Object.entries(missingPatterns).forEach(([code, rec]) => {
      if (rec.total >= 5 && rec.avMissing / rec.total > 0.4) {
        results.missingDataPatterns.push({
          empCode: code,
          empName: rec.name,
          missingRate: ((rec.avMissing / rec.total) * 100).toFixed(1),
          severity: 'MEDIUM'
        });
      }
    });

    // 4. STATISTICAL OUTLIERS (AV only)
    const avValid = data.filter(r => r.av !== null).map(r => r.av);
    if (avValid.length > 2) {
      const mean = avValid.reduce((a, b) => a + b, 0) / avValid.length;
      const variance = avValid.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / avValid.length;
      const stdDev = Math.sqrt(variance);
      if (stdDev > 0) {
        data.forEach(r => {
          if (r.av !== null && Math.abs(r.av - mean) > 2 * stdDev) {
            results.statisticalOutliers.push({
              empCode: r.empCode,
              empName: r.empName,
              shopName: r.shopName,
              av: r.av,
              zScore: ((r.av - mean) / stdDev).toFixed(2),
              severity: r.av > mean ? 'HIGH' : 'LOW'
            });
          }
        });
      }
    }

    // 5. TOO CONSISTENT (low variance + high value)
    Object.entries(shopVisitGroups).forEach(([key, visits]) => {
      if (visits.length >= 3) {
        const avs = visits.map(v => v.av).filter(v => v !== null);
        if (avs.length >= 3) {
          const meanAv = avs.reduce((a, b) => a + b, 0) / avs.length;
          const variance = avs.reduce((sum, val) => sum + Math.pow(val - meanAv, 2), 0) / avs.length;
          if (variance < 0.1 && meanAv >= 5) {
            results.tooConsistent.push({
              empCode: visits[0].empCode,
              empName: visits[0].empName,
              shopName: visits[0].shopName,
              avgAv: meanAv.toFixed(1),
              visits: avs.length,
              severity: 'MEDIUM'
            });
          }
        }
      }
    });

    return results;
  }, [data]);
};

// AGGREGATE RISK SCORE
const useFraudScores = (analysis) => {
  return useMemo(() => {
    const scoreMap = new Map();

    const addScore = (empCode, empName, points, reason) => {
      if (!scoreMap.has(empCode)) {
        scoreMap.set(empCode, { empCode, empName, score: 0, reasons: [] });
      }
      const rec = scoreMap.get(empCode);
      rec.score += points;
      rec.reasons.push(reason);
    };

    analysis.impossibleVisits.forEach(f => addScore(f.empCode, f.empName, 100, 'Impossible Visits'));
    analysis.duplicatePatterns.forEach(f => addScore(f.empCode, f.empName, 60, 'Copy-Paste Data'));
    analysis.missingDataPatterns.forEach(f => addScore(f.empCode, f.empName, 30, 'Strategic Missing AV'));
    analysis.tooConsistent.forEach(f => addScore(f.empCode, f.empName, 25, 'Suspicious Consistency'));
    analysis.statisticalOutliers.forEach(f => addScore(f.empCode, f.empName, 20, 'AV Outlier'));

    return Array.from(scoreMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [analysis]);
};

export default function SamsungFraudDetection() {
  const analysis = useFraudAnalysis(rawData);
  const scores = useFraudScores(analysis);
  const [tab, setTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'duplicates', label: 'Copy-Paste Fraud' },
    { id: 'impossible', label: 'Impossible Visits' },
    { id: 'missing', label: 'Missing Data' },
    { id: 'outliers', label: 'Outliers' }
  ];

  const renderTable = (items, columns) => (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="border-b border-gray-700">
          <tr>{columns.map(col => <th key={col.key} className="text-left p-3">{col.header}</th>)}</tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className="border-b border-gray-800 hover:bg-gray-900/50">
              {columns.map(col => <td key={col.key} className="p-3">{col.render ? col.render(item) : item[col.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && <p className="text-gray-500 p-4 text-center">No issues detected.</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <AlertOctagon className="text-red-500" /> Samsung Fraud Detection Dashboard
          </h1>
          <p className="text-gray-400">Weeks 43–45 • {rawData.length} records analyzed</p>
        </header>

        {/* Risk Score Top 10 */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Users /> Top Fraud Risk Employees
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scores}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="empName" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#ef4444">
                {scores.map((entry, i) => (
                  <Cell key={i} fill={entry.score > 80 ? '#dc2626' : entry.score > 50 ? '#f97316' : '#fbbf24'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map(tabItem => (
            <button
              key={tabItem.id}
              onClick={() => setTab(tabItem.id)}
              className={`px-4 py-2 rounded whitespace-nowrap ${tab === tabItem.id ? 'bg-red-600' : 'bg-gray-800'}`}
            >
              {tabItem.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Impossible Visits', value: analysis.impossibleVisits.length, icon: MapPin },
              { label: 'Copy-Paste Patterns', value: analysis.duplicatePatterns.length, icon: Copy },
              { label: 'Missing AV Data', value: analysis.missingDataPatterns.length, icon: FileWarning },
              { label: 'Statistical Outliers', value: analysis.statisticalOutliers.length, icon: Target }
            ].map((item, i) => (
              <div key={i} className="bg-gray-900 p-4 rounded-lg">
                <item.icon className="w-6 h-6 text-red-500 mb-2" />
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-sm text-gray-400">{item.label}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'duplicates' && renderTable(analysis.duplicatePatterns, [
          { key: 'empName', header: 'Employee' },
          { key: 'shopName', header: 'Shop' },
          { key: 'pattern', header: 'Data Pattern (AV-REF-WM)' },
          { key: 'count', header: 'Repetitions' }
        ])}

        {tab === 'impossible' && renderTable(analysis.impossibleVisits, [
          { key: 'empName', header: 'Employee' },
          { key: 'day', header: 'Date' },
          { key: 'shopCount', header: 'Shops Visited' }
        ])}

        {tab === 'missing' && renderTable(analysis.missingDataPatterns, [
          { key: 'empName', header: 'Employee' },
          { key: 'missingRate', header: 'AV Missing Rate (%)' }
        ])}

        {tab === 'outliers' && renderTable(analysis.statisticalOutliers, [
          { key: 'empName', header: 'Employee' },
          { key: 'shopName', header: 'Shop' },
          { key: 'av', header: 'AV Value' },
          { key: 'zScore', header: 'Z-Score' }
        ])}

        <p className="text-xs text-gray-500 mt-8">
          Note: Geographic impossibility analysis requires store coordinates (not available in dataset).
        </p>
      </div>
    </div>
  );
}