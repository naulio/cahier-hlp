#!/bin/sh
# Salamander Grand Piano V3 (Alexander Holm, CC-BY 3.0) — samples du piano de la musique.
# Trop lourd pour le dépôt (1,2 Go) : à télécharger avant de régénérer la musique.
set -e
D="$(dirname "$0")/../../assets/instruments"
mkdir -p "$D" && cd "$D"
curl -L -o salamander.tar.bz2 "https://archive.org/download/SalamanderGrandPianoV3/SalamanderGrandPianoV3_44.1khz16bit.tar.bz2"
tar xjf salamander.tar.bz2 && rm salamander.tar.bz2
