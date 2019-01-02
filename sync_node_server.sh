#!/bin/bash

files=()
for filename in node_server/*; do
  if [ $filename != "node_modules" ];
  then
    files+=($filename)
  fi   
done

echo files[@]