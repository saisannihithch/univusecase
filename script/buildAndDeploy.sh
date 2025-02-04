#!/bin/bash
 
. ./common_OSX.sh

echo '................ STARTING .............'

function printHelp ()
{
    printHeader
    echo ""
    echo -e "${RESET} options for this exec are: "
    echo -e "${GREEN}-h ${RESET}Print this help information" | indent
    echo -e "${GREEN}-n ${RESET}defaults to ${GREEN}university_example${RESET}. use ${YELLOW}-n your-named-network ${RESET}if you are using a different network name"  | indent
    echo -e "\t\tyou will have to ensure that the name you use here is also the name you use in BOTH package.json files and in your application code" | indent
    echo ""
    echo ""
}

# print the header information for execution
function printHeader ()
{
    echo ""
    echo -e "${YELLOW}network archive, start and deploy script" | indent
    echo -e "${GREEN}This has been tested on Mac OSX thru High Sierra and Ubuntu V16 LTS" | indent
    echo -e "${YELLOW}This script will create your Composer archive" | indent
    echo ""
}
# get the command line options

NETWORK_NAME="university_example"

 while getopts "h:n:" opt; 
do
    case "$opt" in
        h|\?)
        printHelp
        exit 0
        ;;
        n)  showStep "option passed for network name is: '$OPTARG'" 
            if [[ $OPTARG != "" ]]; then 
                NETWORK_NAME=$OPTARG 
            fi
        ;;
    esac
 done

printHeader
echo  "Parameters:"
echo -e "Network Name is: ${GREEN} $NETWORK_NAME ${RESET}" | indent

showStep "creating archive"
./createArchive.sh -n $NETWORK_NAME
showStep "starting network"
./startup.sh
showStep "deploying network"
./deployNetwork.sh -n $NETWORK_NAME
