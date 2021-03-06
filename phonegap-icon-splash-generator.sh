#!/bin/bash
# Generate PhoneGap icon and splash screens.
# Copyright 2013 Tom Vincent <http://tlvince.com/contact>
# https://github.com/tlvince/phonegap-icon-splash-generator

usage() { echo "usage: $0 icon colour [dest_dir]"; exit 1; }

[ "$1" ] && [ "$2" ] || usage
[ "$3" ] || set "$1" "$2" "."

# devices=android,bada,bada-wac,blackberry,ios,webos,windows-phone
# eval mkdir -p "$3/{icon,screen}/{$devices}"

mkdir -p "$3/icon/"
# mkdir -p "$3/icon/ios"
# mkdir -p "$3/screen/android"
# mkdir -p "$3/screen/ios"

# Show the user some progress by outputing all commands being run.
# set -x

# Explicitly set background in case image is transparent (see: #3)
convert="convert -background none"
$convert "$1" -resize 128x128 "$3/icon/icon.png"

# $convert "$1" -resize 36x36 "$3/icon/android/icon-36-ldpi.png"
# $convert "$1" -resize 72x72 "$3/icon/android/icon-72-hdpi.png"
# $convert "$1" -resize 48x48 "$3/icon/android/icon-48-mdpi.png"
# $convert "$1" -resize 96x96 "$3/icon/android/icon-96-xhdpi.png"
# $convert "$1" -resize 128x128 "$3/icon/bada/icon-128.png"
# $convert "$1" -resize 48x48 "$3/icon/bada-wac/icon-48-type5.png"
# $convert "$1" -resize 80x80 "$3/icon/bada-wac/icon-80-type4.png"
# $convert "$1" -resize 50x50 "$3/icon/bada-wac/icon-50-type3.png"
# $convert "$1" -resize 80x80 "$3/icon/blackberry/icon-80.png"
# $convert "$1" -resize 29x29 "$3/icon/ios/icon-29.png"
# $convert "$1" -resize 40x40 "$3/icon/ios/icon-40.png"
# $convert "$1" -resize 50x50 "$3/icon/ios/icon-50.png"
# $convert "$1" -resize 57x57 "$3/icon/ios/icon-57.png"
# $convert "$1" -resize 58x58 "$3/icon/ios/icon-58.png"
# $convert "$1" -resize 72x72 "$3/icon/ios/icon-72.png"
$convert "$1" -resize 76x76 "$3/icon/icon-76.png"
# $convert "$1" -resize 80x80 "$3/icon/ios/icon-80.png"
# $convert "$1" -resize 100x100 "$3/icon/ios/icon-100.png"
# $convert "$1" -resize 144x144 "$3/icon/ios/icon-144.png"
# $convert "$1" -resize 114x114 "$3/icon/ios/icon-114.png"
$convert "$1" -resize 120x120 "$3/icon/icon-120.png"
$convert "$1" -resize 152x152 "$3/icon/icon-152.png"
# $convert "$1" -resize 152x152 "$3/icon/ios/icon-180.png"
# $convert "$1" -resize 64x64 "$3/icon/webos/icon-64.png"
# $convert "$1" -resize 48x48 "$3/icon/windows-phone/icon-48.png"
# $convert "$1" -resize 173x173 "$3/icon/windows-phone/icon-173-tile.png"
# $convert "$1" -resize 62x62 "$3/icon/windows-phone/icon-62-tile.png"

convert="convert $1 -background $2 -gravity center"
# $convert -resize 512x512 -extent 1280x720 "$3/screen/android/screen-xhdpi-landscape.png"
# $convert -resize 256x256 -extent 480x800 "$3/screen/android/screen-hdpi-portrait.png"
# $convert -resize 128x128 -extent 320x200 "$3/screen/android/screen-ldpi-landscape.png"
# $convert -resize 512x512 -extent 720x1280 "$3/screen/android/screen-xhdpi-portrait.png"
# $convert -resize 256x256 -extent 320x480 "$3/screen/android/screen-mdpi-portrait.png"
# $convert -resize 256x256 -extent 480x320 "$3/screen/android/screen-mdpi-landscape.png"
# $convert -resize 128x128 -extent 200x320 "$3/screen/android/screen-ldpi-portrait.png"
# $convert -resize 256x256 -extent 800x480 "$3/screen/android/screen-hdpi-landscape.png"
# # $convert -resize 256x256 -extent 480x800 "$3/screen/bada/screen-portrait.png"
# # $convert -resize 128x128 -extent 320x480 "$3/screen/bada-wac/screen-type3.png"
# # $convert -resize 256x256 -extent 480x800 "$3/screen/bada-wac/screen-type4.png"
# # $convert -resize 128x128 -extent 240x400 "$3/screen/bada-wac/screen-type5.png"
# # $convert -resize 256x256 -extent 480x800 "$3/screen/bada-wac/screen-type5.png"
# # $convert -resize 128x128 -extent 225x225 "$3/screen/blackberry/screen-225.png"
# $convert -resize 256x256 -extent 320x480 "$3/screen/ios/screen-iphone-portrait.png"
# $convert -resize 256x256 -extent 960x640 "$3/screen/ios/screen-iphone-landscape-2x.png"
# $convert -resize 256x256 -extent 480x320 "$3/screen/ios/screen-iphone-landscape.png"
# $convert -resize 512x512 -extent 768x1004 "$3/screen/ios/screen-ipad-portrait.png"
# $convert -resize 1024x1024 -extent 1536x2008 "$3/screen/ios/screen-ipad-portrait-2x.png"
# $convert -resize 512x512 -extent 1024x783 "$3/screen/ios/screen-ipad-landscape.png"
$convert -resize 512x512 -extent 640x960 "$3/icon/screen-iphone-portrait-2x.png"
# $convert -resize 512x512 -extent 640x1136 "$3/screen/ios/screen-iphone-5s-portrait-2x.png"
# $convert -resize 512x512 -extent 750x1334 "$3/screen/ios/screen-iphone-6-portrait-2x.png"
# $convert -resize 512x512 -extent 1080x1920 "$3/screen/ios/screen-iphone-6plus-portrait-2x.png"
# $convert -resize 1024x1024 -extent 2008x1536 "$3/screen/ios/screen-ipad-landscape-2x.png"
# # convert "$1" -resize 64x64 "$3/screen/webos/screen-64.png"
# # $convert -resize 256x256 -extent 480x800 "$3/screen/windows-phone/screen-portrait.jpg"