# M3U IPTV Viewer

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/quality_gate?project=MinionAttack_m3u-iptv-viewer)](https://sonarcloud.io/summary/new_code?id=MinionAttack_m3u-iptv-viewer)

A lightweight, privacy-focused website that lets you easily view the contents of your IPTV provider’s M3U file.

Table of contents.

* [Author disclaimer](#author-disclaimer)
* [Introduction](#introduction)
* [Information notes](#information-notes)
    * [Local Storage](#local-storage)
    * [Language selector emojis](#language-selector-emojis)
    * [Content available for searching](#content-available-for-searching)
    * [Initial processing time and storage (Indexed DB)](#initial-processing-time-and-storage-indexed-db)
* [How to use](#how-to-use)
* [Licensing agreement](#licensing-agreement)

## Author disclaimer

This project has been carried out solely and exclusively for self-learning reasons and to show it as a career portfolio.

This project (website) does not violate the *Digital Millennium Copyright Act* (*DMCA*) because it only indicates where
the information the user is looking for is located. No software, images, movies, series, or music are stored on a server
owned by the author of this project (website), and this project (website) does not make illegal copies, or damage or
infringe any *Copyright*©.

Everything that this project (website) processes and sends to the user who has requested it is available on the
*World Wide Web*, the Internet, so this project (website) only limits itself to saying where the information is and how
to get it, this project (website) does not provide it.

## Introduction

In recent years, IPTV services have come under scrutiny due to a court ruling that allows ISPs in Spain to block IP
addresses indiscriminately. For further information, please see the following link, available in Spanish and English:
[¿Hay ahora fútbol?](https://hayahora.futbol/). Since the blocks affect everything except IPTV services, and as a user
of IPTV services, I came up with the idea of creating a website that makes it easier to find the link to the content
you’re looking for, rather than opening the file and having to search through thousands of lines of text.

This is because IPTV files (usually private ones) are huge and already come with an app that makes it easy to watch the
content. With most providers, this app is only available for Smart TV or Android devices, so if you want to find the
link from a computer, you have to open the file and search for it manually. It is not possible to open these files with
[VLC](https://www.videolan.org/), as due to their size, the application eventually stops responding, and you have to
force it to close.

What’s more, the website had to be 100% private, with no tracking, telemetry, or adverts. And it had to work even
without an internet connection.

## Information notes

### Local Storage

The app saves two values if the user interacts with the selectors:

1. selectedLocale: The language selected in the language selector. By default, the app checks the browser’s preferred
   languages and, if they are available, uses the first one. If the first one is not available, English is used.
2. themeMode: The theme selected in the theme selector. By default, the app retrieves the operating system settings via
   the browser and adjusts accordingly.

### Language selector emojis

The language selector uses emojis to display the language flag. However, the emojis do not always appear due to issues
unrelated to the app.

Windows does not have native support for country flag emojis. For political reasons and to avoid diplomatic disputes
over disputed territories, Microsoft decided not to include flags in its default system font (Segoe UI Emoji). Instead
of displaying the flag as a single character, Windows displays the two letters of the country’s ISO country code (for
example, ‘E’ and ‘S’ for the Spanish flag emoji).

|     OS      | Emoji Support |                                     Reason                                      |
|:-----------:|:-------------:|:-------------------------------------------------------------------------------:|
|   Windows   |      No       |                     A design/policy decision by Microsoft.                      |
| macOS / iOS |      Yes      |                     Apple uses its Apple Color Emoji font.                      |
|   Android   |      Yes      |                     Google uses its Noto Color Emoji font.                      |
|    Linux    |    Partial    | It depends on whether the distribution has the Noto Color Emoji font installed. |

### Content available for searching

Once the file has been processed, a bar containing a search box will appear. To the left of the search box are three
switches: one for TV channels, one for TV series, and one for films. These indicate what content the processed file
contains; if a switch is active, you can search for results in that category; if it is inactive, the file does not
include items from that category.

### Initial processing time and storage (Indexed DB)

Depending on the file size, the initial upload may take a little longer or a little shorter. As long as the spinner is
visible in the window, indicating that the file is being processed, the process is not yet complete. Every time a file
is processed, the Indexed DB is deleted and recreated.

By way of example, the table below shows the processing times and storage space used for a small file and a large file
on two different computer configurations.

* File size:
    + Small file: 1.890 entries.
    + Big file: 154.785 entries.


* Computer configuration:
    + Old laptop (Medion Erazer X7829)
        + CPU: Intel Core i7-4710MQ
        + iGPU: Intel® HD Graphics 4600
        + GPU: nVidia Geforce GTX 870M (disabled, burned)
        + RAM: 16 GB DDR3
        + Storage: Samsung 850 PRO 256 GB
    + New laptop (Lenovo Legion 7 Gen 7 AMD Advantage)
        + CPU: AMD Ryzen 9 6900HX
        + iGPU: AMD Radeon 680M
        + GPU: AMD Radeon RX 6850M XT
        + RAM: 32 GB DDR5
        + Storage: WD_BLACK SN850X NVMe SSD 2TB

| File size |     Metric      |        Old laptop         |        New laptop         |
|:---------:|:---------------:|:-------------------------:|:-------------------------:|
|   Small   | Processing time |        ~ 2 seconds        |        ~ 0 seconds        |
|           |  Storage size   |         ~ 1.6 MB          |         ~ 1.6 MB          |
|    Big    | Processing time | ~ 3 minutes and 6 seconds | ~ 1 minute and 35 seconds |
|           |  Storage size   |         ~ 117 MB          |         ~ 117 MB          |

The size of the IndexedDB will always remain the same; the only thing that may vary is the processing time, depending on
the system’s current workload whilst the file is being processed.

## How to use

1. Go to the [M3U IPTV Viewer website](https://m3uiptvviewer.thetechnicallyweakguy.com/).
2. Select a file (if it is not compatible, a message will appear) and then click _Process_.
3. Wait for the file to finish processing.
4. You can search through the available content.

or

1. Go to the [M3U IPTV Viewer website](https://m3uiptvviewer.thetechnicallyweakguy.com/).
2. If you have already processed a file, you will see a message on the website informing you that data has already been
   saved.
3. You can search through the available content.

## Licensing agreement

Copyright © 2026 MinionAttack

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR
OTHERWISE, ARISING FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 