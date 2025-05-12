#!/usr/bin/env bash

base_name="${0##*/}"
current_directory=$(
  cd "$(dirname "$0")" || exit 1
  pwd
)

usage() {
  printf "Usage: %s\n \
    -d <You can specify the directory of yeying-idl, default third_party/yeying-idl\n \
    " "${base_name}"
}

cd "${current_directory}"/.. || exit 1
runtime_directory=$(pwd)
idl_dir=${runtime_directory}/third_party/yeying-idl

# For macos`s getopt, reference: https://formulae.brew.sh/formula/gnu-getopt
while getopts ":d:" o; do
  case "${o}" in
  d)
    idl_dir=${OPTARG}
    ;;
  *)
    usage
    ;;
  esac
done
shift $((OPTIND - 1))

language=typescript
app_type=browser

output_dir=${idl_dir}/target/${app_type}/${language}
tool=${idl_dir}/script/compiler.sh

if ! "${tool}" -t ${app_type} -m common,llm,asset,user,identity,node,service,certificate,application,event,invitation,bulletin,support,mail,config,session -l ${language}; then
  echo "Fail to generate proto code!"
  exit 1
fi

yeying_api_directory="${runtime_directory}"/src/yeying/api
if [ -d "${yeying_api_directory}" ]; then
  rm -rvf "${yeying_api_directory}"
fi

mkdir -p "${yeying_api_directory}"
cp -rvf "${output_dir}"/yeying/api/* "${yeying_api_directory}"/
#find "${yeying_api_directory}" -type f | while read file; do
#  sed -i '' 's/\.js/\.cjs/g' "${file}"
#  mv -v "${file}" "${file%.js}.cjs"
#done
echo -e "\nThis is the end.$(date)"
