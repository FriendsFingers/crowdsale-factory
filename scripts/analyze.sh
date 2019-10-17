#!/usr/bin/env bash

surya inheritance dist/FriendlyCrowdsale.dist.sol | dot -Tpng > analysis/inheritance-tree/FriendlyCrowdsale.png

surya graph dist/FriendlyCrowdsale.dist.sol | dot -Tpng > analysis/control-flow/FriendlyCrowdsale.png

surya mdreport analysis/description-table/FriendlyCrowdsale.md dist/FriendlyCrowdsale.dist.sol

sol2uml dist/FriendlyCrowdsale.dist.sol -o analysis/uml/FriendlyCrowdsale.svg
