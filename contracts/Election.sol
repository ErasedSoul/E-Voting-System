//pragma solidity >=0.6.0 <0.8.0;
pragma solidity ^0.5.16;
//pragma experimental ABIEncoderV2;

contract Election {

    // model a ballot 
    struct Ballot {
        uint id;
        string name;
        string startTime; // should be uint
        string endTime;  // should be uint
        uint candidatesCount;
        mapping(uint => Candidate) candidates;
       //  mapping(address => bool) voters;
       mapping(string => Vote) voters; // sql userid 
    }

    // Model a Candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Model a vote
    struct Vote {
        bool voted; 
        uint voteTime;
        uint blockNo; 
    }

    // Store ballot Count
    uint public ballotCount;

    // Read/write ballot
    mapping(uint => Ballot) public ballots;

    constructor() public {
        ballotCount = 0;
    }

    function substring(string memory str, uint startIndex, uint endIndex) private returns (string memory) {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(endIndex-startIndex);
        for(uint i = startIndex; i < endIndex; i++) {
            result[i-startIndex] = strBytes[i];
        }
        return string(result);
    }

    function addBallot (string memory name,
        string memory startTime,
        string memory endTime,
        string memory str ) public returns (uint ballotID) {

        ballotCount++;
        ballotID = ballotCount;

        Ballot storage b = ballots[ballotCount]; 
        b.id = ballotCount; 
        b.name = name;
        b.startTime = startTime;
        b.endTime = endTime;


        bytes memory strBytes = bytes(str);
        bytes memory seperator = bytes(",");
        uint y = 0;
        uint id = 0;
        for(uint x = 0; x < strBytes.length; x++){
            if(strBytes[x] == seperator[0] ){
                // split
                string memory n = substring(str, y, x);
                id ++;
                b.candidatesCount = id; 
                b.candidates[id] = Candidate(id, n, 0);
                y = x+1;
            }
        }
    }

    function getCandidate(uint ballotID, uint canID) public view returns 
    (uint id, string memory name, uint voteCount) {
        id = ballots[ballotID].candidates[canID].id;
        name = ballots[ballotID].candidates[canID].name;
        voteCount = ballots[ballotID].candidates[canID].voteCount;
    }

    function votedORnot(uint ballotID, string memory voterName) 
    public view returns (bool voted, uint voteTime, uint blockNo) {
        voted = ballots[ballotID].voters[voterName].voted; 
        voteTime = ballots[ballotID].voters[voterName].voteTime; 
        blockNo = ballots[ballotID].voters[voterName].blockNo;
    }

    function vote (uint ballotID, uint _candidateId, string memory voterName) public {
        // require that they haven't voted before
        require(!ballots[ballotID].voters[voterName].voted);

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= ballots[ballotID].candidatesCount);

        // record that voter has voted
        ballots[ballotID].voters[voterName].voted = true;
        ballots[ballotID].voters[voterName].voteTime = block.timestamp; 
        ballots[ballotID].voters[voterName].blockNo = block.number; 

        // update candidate vote Count
        ballots[ballotID].candidates[_candidateId].voteCount ++;
    }

}