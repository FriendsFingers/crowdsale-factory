## Sūrya's Description Report

### Files Description Table


|  File Name  |  SHA-1 Hash  |
|-------------|--------------|
| dist/FriendlyCrowdsale.dist.sol | be67d9cfa46667c113a4263bef7cb0d92102fe6b |


### Contracts Description Table


|  Contract  |         Type        |       Bases      |                  |                 |
|:----------:|:-------------------:|:----------------:|:----------------:|:---------------:|
|     └      |  **Function Name**  |  **Visibility**  |  **Mutability**  |  **Modifiers**  |
||||||
| **SafeMath** | Library |  |||
| └ | add | Internal 🔒 |   | |
| └ | sub | Internal 🔒 |   | |
| └ | sub | Internal 🔒 |   | |
| └ | mul | Internal 🔒 |   | |
| └ | div | Internal 🔒 |   | |
| └ | div | Internal 🔒 |   | |
| └ | mod | Internal 🔒 |   | |
| └ | mod | Internal 🔒 |   | |
||||||
| **IERC20** | Interface |  |||
| └ | totalSupply | External ❗️ |   |NO❗️ |
| └ | balanceOf | External ❗️ |   |NO❗️ |
| └ | transfer | External ❗️ | 🛑  |NO❗️ |
| └ | allowance | External ❗️ |   |NO❗️ |
| └ | approve | External ❗️ | 🛑  |NO❗️ |
| └ | transferFrom | External ❗️ | 🛑  |NO❗️ |
||||||
| **Address** | Library |  |||
| └ | isContract | Internal 🔒 |   | |
| └ | sendValue | Internal 🔒 | 🛑  | |
| └ | functionCall | Internal 🔒 | 🛑  | |
| └ | functionCall | Internal 🔒 | 🛑  | |
| └ | functionCallWithValue | Internal 🔒 | 🛑  | |
| └ | functionCallWithValue | Internal 🔒 | 🛑  | |
| └ | functionStaticCall | Internal 🔒 |   | |
| └ | functionStaticCall | Internal 🔒 |   | |
| └ | _verifyCallResult | Private 🔐 |   | |
||||||
| **SafeERC20** | Library |  |||
| └ | safeTransfer | Internal 🔒 | 🛑  | |
| └ | safeTransferFrom | Internal 🔒 | 🛑  | |
| └ | safeApprove | Internal 🔒 | 🛑  | |
| └ | safeIncreaseAllowance | Internal 🔒 | 🛑  | |
| └ | safeDecreaseAllowance | Internal 🔒 | 🛑  | |
| └ | _callOptionalReturn | Private 🔐 | 🛑  | |
||||||
| **ReentrancyGuard** | Implementation |  |||
| └ | <Constructor> | Public ❗️ | 🛑  |NO❗️ |
||||||
| **EnumerableSet** | Library |  |||
| └ | _add | Private 🔐 | 🛑  | |
| └ | _remove | Private 🔐 | 🛑  | |
| └ | _contains | Private 🔐 |   | |
| └ | _length | Private 🔐 |   | |
| └ | _at | Private 🔐 |   | |
| └ | add | Internal 🔒 | 🛑  | |
| └ | remove | Internal 🔒 | 🛑  | |
| └ | contains | Internal 🔒 |   | |
| └ | length | Internal 🔒 |   | |
| └ | at | Internal 🔒 |   | |
| └ | add | Internal 🔒 | 🛑  | |
| └ | remove | Internal 🔒 | 🛑  | |
| └ | contains | Internal 🔒 |   | |
| └ | length | Internal 🔒 |   | |
| └ | at | Internal 🔒 |   | |
| └ | add | Internal 🔒 | 🛑  | |
| └ | remove | Internal 🔒 | 🛑  | |
| └ | contains | Internal 🔒 |   | |
| └ | length | Internal 🔒 |   | |
| └ | at | Internal 🔒 |   | |
||||||
| **Context** | Implementation |  |||
| └ | _msgSender | Internal 🔒 |   | |
| └ | _msgData | Internal 🔒 |   | |
||||||
| **AccessControl** | Implementation | Context |||
| └ | hasRole | Public ❗️ |   |NO❗️ |
| └ | getRoleMemberCount | Public ❗️ |   |NO❗️ |
| └ | getRoleMember | Public ❗️ |   |NO❗️ |
| └ | getRoleAdmin | Public ❗️ |   |NO❗️ |
| └ | grantRole | Public ❗️ | 🛑  |NO❗️ |
| └ | revokeRole | Public ❗️ | 🛑  |NO❗️ |
| └ | renounceRole | Public ❗️ | 🛑  |NO❗️ |
| └ | _setupRole | Internal 🔒 | 🛑  | |
| └ | _setRoleAdmin | Internal 🔒 | 🛑  | |
| └ | _grantRole | Private 🔐 | 🛑  | |
| └ | _revokeRole | Private 🔐 | 🛑  | |
||||||
| **Roles** | Implementation | AccessControl |||
| └ | <Constructor> | Public ❗️ | 🛑  |NO❗️ |
||||||
| **FriendlyCrowdsale** | Implementation | ReentrancyGuard, Roles |||
| └ | <Constructor> | Public ❗️ | 🛑  |NO❗️ |
| └ | <Receive Ether> | External ❗️ |  💵 |NO❗️ |
| └ | token | External ❗️ |   |NO❗️ |
| └ | wallet | External ❗️ |   |NO❗️ |
| └ | rate | External ❗️ |   |NO❗️ |
| └ | weiRaised | External ❗️ |   |NO❗️ |
| └ | cap | External ❗️ |   |NO❗️ |
| └ | openingTime | External ❗️ |   |NO❗️ |
| └ | closingTime | External ❗️ |   |NO❗️ |
| └ | finalized | External ❗️ |   |NO❗️ |
| └ | feeWallet | External ❗️ |   |NO❗️ |
| └ | feePerMille | External ❗️ |   |NO❗️ |
| └ | goal | External ❗️ |   |NO❗️ |
| └ | state | External ❗️ |   |NO❗️ |
| └ | capReached | Public ❗️ |   |NO❗️ |
| └ | hasClosed | Public ❗️ |   |NO❗️ |
| └ | started | Public ❗️ |   |NO❗️ |
| └ | ended | Public ❗️ |   |NO❗️ |
| └ | isOpen | Public ❗️ |   |NO❗️ |
| └ | goalReached | Public ❗️ |   |NO❗️ |
| └ | investorsNumber | Public ❗️ |   |NO❗️ |
| └ | investorExists | Public ❗️ |   |NO❗️ |
| └ | getInvestorAddress | Public ❗️ |   |NO❗️ |
| └ | weiContribution | Public ❗️ |   |NO❗️ |
| └ | purchasedTokens | Public ❗️ |   |NO❗️ |
| └ | buyTokens | Public ❗️ |  💵 | nonReentrant |
| └ | enable | Public ❗️ | 🛑  | onlyOperator |
| └ | reject | Public ❗️ | 🛑  | onlyOperator |
| └ | finalize | Public ❗️ | 🛑  |NO❗️ |
| └ | claimRefund | Public ❗️ | 🛑  |NO❗️ |
| └ | setExpiredAndWithdraw | Public ❗️ | 🛑  | onlyOperator |
| └ | _preValidatePurchase | Internal 🔒 |   | |
| └ | _postValidatePurchase | Internal 🔒 |   | |
| └ | _deliverTokens | Internal 🔒 | 🛑  | |
| └ | _processPurchase | Internal 🔒 | 🛑  | |
| └ | _updatePurchasingState | Internal 🔒 | 🛑  | |
| └ | _getTokenAmount | Internal 🔒 |   | |
| └ | _finalization | Internal 🔒 | 🛑  | |
| └ | _forwardFunds | Internal 🔒 | 🛑  | |
| └ | _close | Internal 🔒 | 🛑  | |
| └ | _enableRefunds | Internal 🔒 | 🛑  | |
| └ | _recoverRemainingTokens | Internal 🔒 | 🛑  | |


### Legend

|  Symbol  |  Meaning  |
|:--------:|-----------|
|    🛑    | Function can modify state |
|    💵    | Function is payable |
