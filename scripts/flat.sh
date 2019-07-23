#!/usr/bin/env bash

truffle-flattener contracts/utils/Contributions.sol > dist/Contributions.dist.sol
truffle-flattener contracts/crowdsale/FriendlyCrowdsale.sol > dist/FriendlyCrowdsale.dist.sol
