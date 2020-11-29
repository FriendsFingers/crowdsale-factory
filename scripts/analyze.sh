#!/usr/bin/env bash

npx surya inheritance dist/FriendlyCrowdsale.dist.sol | dot -Tpng > analysis/inheritance-tree/FriendlyCrowdsale.png

npx surya graph dist/FriendlyCrowdsale.dist.sol | dot -Tpng > analysis/control-flow/FriendlyCrowdsale.png

npx surya mdreport analysis/description-table/FriendlyCrowdsale.md dist/FriendlyCrowdsale.dist.sol

npx sol2uml dist/FriendlyCrowdsale.dist.sol -o analysis/uml/FriendlyCrowdsale.svg
