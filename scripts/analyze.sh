#!/usr/bin/env bash

surya inheritance dist/Contributions.dist.sol | dot -Tpng > analysis/inheritance-tree/Contributions.png
surya inheritance dist/FriendlyCrowdsale.dist.sol | dot -Tpng > analysis/inheritance-tree/FriendlyCrowdsale.png

surya graph dist/Contributions.dist.sol | dot -Tpng > analysis/control-flow/Contributions.png
surya graph dist/FriendlyCrowdsale.dist.sol | dot -Tpng > analysis/control-flow/FriendlyCrowdsale.png

surya mdreport analysis/description-table/Contributions.md dist/Contributions.dist.sol
surya mdreport analysis/description-table/FriendlyCrowdsale.md dist/FriendlyCrowdsale.dist.sol
