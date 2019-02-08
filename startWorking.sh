#!/bin/bash
. ~/scripts/biblioteca_funcoes.sh # Include da minha biblioteca de funções

workspace=$(dirname $0)

#Redefinindo as dimensões deste terminal
setTerminalWidth 175
setTerminalHeight 45

cd $workspace

clear

#Montando arquivo de configuração do screen
tempFile=$(geraArquivoTemporario "screencfgAngular") #Criando o arquivo de configuração do screen
>$tempFile

#NG SERVE
echo "screen -t NG_SERVE ng serve" >> $tempFile #Crio uma nova sessão na seção 'NG_SERVE'
echo "zombie k" >> $tempFile #Indico que esta seção deve ser preservada quando finalizar
echo "split" >> $tempFile #Divido a seção atual horizontalmente
echo "split -v" >> $tempFile #Divido a seção atual verticalmente

#NODEMON
echo "focus" >> $tempFile    #Movo o foco para a próxima seção (NODEMON)
echo "screen -t NODEMON nodemon --watch backend --exec \"ts-node\" backend/server.ts" >> $tempFile #Crio uma nova sessão na seção 'NODEMON'
echo "zombie k" >> $tempFile #Indico que esta seção deve ser preservada quando finalizar

#TERMINAL
echo "focus" >> $tempFile    #Movo o foco para a próxima seção (TERMINAL)
echo "screen -t TERMINAL bash" >> $tempFile #Crio uma nova sessão na seção 'TERMINAL'

screen -S meuscreenAngular -c $tempFile
