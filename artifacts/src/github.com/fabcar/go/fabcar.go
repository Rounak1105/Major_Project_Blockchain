package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	sc "github.com/hyperledger/fabric-protos-go/peer"
	"github.com/hyperledger/fabric/common/flogging"

	"github.com/hyperledger/fabric-chaincode-go/pkg/cid"
)

// SmartContract Define the Smart Contract structure
type SmartContract struct {
}

// Unit :  Define the unit structure, with 8 properties.  Structure tags are used by encoding/json library

// Mediceit fn
type Unit struct {
	Unit_id string `json:"uid"`
	Name string `json:"name"`
	Curr_Owner string `json:"owner"`
	Quantity string `json:"quantity"`
	Manufacturer string `json:"manufacturer"`
	Date string `json:"date"`
	Location string `json:"location"`
	Remark string `json:"remark"`
	
}

// Init ;  Method for initializing smart contract
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

var logger = flogging.MustGetLogger("fabcar_cc")

// Invoke :  Method for INVOKING smart contract

// Mediceit fn
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	function, args := APIstub.GetFunctionAndParameters()
	logger.Infof("Function name is:  %d", function)
	logger.Infof("Args length is : %d", len(args))

	switch function {
	case "addUnit":
		return s.addUnit(APIstub, args)
	case "queryUnit":
		return s.queryUnit(APIstub, args)
	case "changeUnitOwner":
		return s.changeUnitOwner(APIstub, args)
	case "getHistoryForUnit":
		return s.getHistoryForUnit(APIstub, args)
	case "queryAllUnits":
		return s.queryAllUnits(APIstub)
	case "restrictedAddUnit":   //restricted method
		return s.restrictedAddUnit(APIstub, args)
	case "restrictedChangeUnitOwner":		//restricted method
		return s.restrictedChangeUnitOwner(APIstub, args)
	case "restrictedChangeUnitLocation":
		return s.restrictedChangeUnitLocation(APIstub, args)
	case "queryUnitsByOwner":
		return s.queryUnitsByOwner(APIstub, args)
	case "initLedger":
		return s.initLedger(APIstub)
	
	default:
		return shim.Error("Invalid Smart Contract function name.")
	}

	// return shim.Error("Invalid Smart Contract function name.")
}

// Mediceit fn

func (s *SmartContract) queryUnit(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	unitAsBytes, _ := APIstub.GetState(args[0])
	return shim.Success(unitAsBytes)
}

func (s *SmartContract) addUnit(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 8 {
		return shim.Error("Incorrect number of arguments. Expecting 8")
	}
	// Name string `json:"name"`
	// Curr_Owner string `json:"owner"`
	// Quantity string `json:"quantity"`
	// Manufacturer string `json:"manufacturer"`
	// Date string `json:"date"`
	var unit = Unit{Unit_id : args[0],Name: args[1], Curr_Owner: args[2], Quantity: args[3], Manufacturer: args[4], Date: args[5],Location: args[6],Remark: args[7]}
	// args[0]=id
	unitAsBytes, _ := json.Marshal(unit)
	APIstub.PutState(args[0], unitAsBytes)

	indexName := "owner~key"
	addUnitIndexKey, err := APIstub.CreateCompositeKey(indexName, []string{unit.Curr_Owner, args[0]})
	if err != nil {
		return shim.Error(err.Error())
	}
	value := []byte{0x00}
	APIstub.PutState(addUnitIndexKey, value)

	return shim.Success(unitAsBytes)
}

func (s *SmartContract) queryAllUnits(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "Unit0"
	endKey := "Unit999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllUnits:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

func (t *SmartContract) getHistoryForUnit(stub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	unitName := args[0]

	resultsIterator, err := stub.GetHistoryForKey(unitName)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing historic values for the marble
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"TxId\":")
		buffer.WriteString("\"")
		buffer.WriteString(response.TxId)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Value\":")
		// if it was a delete operation on given key, then we need to set the
		//corresponding value null. Else, we will write the response.Value
		//as-is (as the Value itself a JSON marble)
		if response.IsDelete {
			buffer.WriteString("null")
		} else {
			buffer.WriteString(string(response.Value))
		}

		buffer.WriteString(", \"Timestamp\":")
		buffer.WriteString("\"")
		buffer.WriteString(time.Unix(response.Timestamp.Seconds, int64(response.Timestamp.Nanos)).String())
		buffer.WriteString("\"")

		buffer.WriteString(", \"IsDelete\":")
		buffer.WriteString("\"")
		buffer.WriteString(strconv.FormatBool(response.IsDelete))
		buffer.WriteString("\"")

		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- getHistoryForAsset returning:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

func (s *SmartContract) changeUnitOwner(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	unitAsBytes, _ := APIstub.GetState(args[0])
	unit := Unit{}

	json.Unmarshal(unitAsBytes, &unit)
	unit.Curr_Owner = args[1]

	unitAsBytes, _ = json.Marshal(unit)
	APIstub.PutState(args[0], unitAsBytes)

	return shim.Success(unitAsBytes)
}

func (S *SmartContract) queryUnitsByOwner(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments")
	}
	owner := args[0]

	ownerAndIdResultIterator, err := APIstub.GetStateByPartialCompositeKey("owner~key", []string{owner})
	if err != nil {
		return shim.Error(err.Error())
	}

	defer ownerAndIdResultIterator.Close()

	var i int
	var id string

	var units []byte
	bArrayMemberAlreadyWritten := false

	units = append([]byte("["))

	for i = 0; ownerAndIdResultIterator.HasNext(); i++ {
		responseRange, err := ownerAndIdResultIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		objectType, compositeKeyParts, err := APIstub.SplitCompositeKey(responseRange.Key)
		if err != nil {
			return shim.Error(err.Error())
		}

		id = compositeKeyParts[1]
		assetAsBytes, err := APIstub.GetState(id)

		if bArrayMemberAlreadyWritten == true {
			newBytes := append([]byte(","), assetAsBytes...)
			units = append(units, newBytes...)

		} else {
			// newBytes := append([]byte(","), unitsAsBytes...)
			units = append(units, assetAsBytes...)
		}

		fmt.Printf("Found a asset for index : %s asset id : ", objectType, compositeKeyParts[0], compositeKeyParts[1])
		bArrayMemberAlreadyWritten = true

	}

	units = append(units, []byte("]")...)

	return shim.Success(units)
}


// REstricted Methods

func (s *SmartContract) restrictedAddUnit(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	val, ok, err := cid.GetAttributeValue(APIstub, "role")
	if err != nil {
		// There was an error trying to retrieve the attribute
		shim.Error("Error while retriving attributes")
	}
	if !ok {
		// The client identity does not possess the attribute
		shim.Error("Client identity doesnot posses the attribute")
	}
	// Do something with the value of 'val'
	if val!="manufacturer" {
		fmt.Println("Attribute role: " + val)
		return shim.Error("Only user with role as MANUFACTURER have access this method!")
	} else {
		
		if len(args) != 8 {
			return shim.Error("Incorrect number of arguments. Expecting 8")
		}
		// Name string `json:"name"`
		// Curr_Owner string `json:"owner"`
		// Quantity string `json:"quantity"`
		// Manufacturer string `json:"manufacturer"`
		// Date string `json:"date"`
		var unit = Unit{Unit_id : args[0],Name: args[1], Curr_Owner: args[2], Quantity: args[3], Manufacturer: args[4], Date: args[5],Location: args[6],Remark: args[7]}
		// args[0]=id
		unitAsBytes, _ := json.Marshal(unit)
		APIstub.PutState(args[0], unitAsBytes)
	
		indexName := "owner~key"
		colorNameIndexKey, err := APIstub.CreateCompositeKey(indexName, []string{unit.Curr_Owner, args[0]})
		if err != nil {
			return shim.Error(err.Error())
		}
		value := []byte{0x00}
		APIstub.PutState(colorNameIndexKey, value)
	
		return shim.Success(unitAsBytes)
}
}


func (s *SmartContract) restrictedChangeUnitOwner(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	val, ok, err := cid.GetAttributeValue(APIstub, "role")
	if err != nil {
		// There was an error trying to retrieve the attribute
		shim.Error("Error while retriving attributes")
	}
	if !ok {
		// The client identity does not possess the attribute
		shim.Error("Client identity doesnot posses the attribute")
	}
	// Do something with the value of 'val'
	if val != "distributor" {
		fmt.Println("Attribute role: " + val)
		return shim.Error("Only user with role as Distributor have access this method!")
	} else {

		if len(args) != 3 {
			return shim.Error("Incorrect number of arguments. Expecting 3")
		}
	
		unitAsBytes, _ := APIstub.GetState(args[0])
		unit := Unit{}
	
		json.Unmarshal(unitAsBytes, &unit)
		unit.Curr_Owner = args[1]
		unit.Location = args[2]
	
		unitAsBytes, _ = json.Marshal(unit)
		APIstub.PutState(args[0], unitAsBytes)
	
		return shim.Success(unitAsBytes)
}
}

func (s *SmartContract) restrictedChangeUnitLocation(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	val, ok, err := cid.GetAttributeValue(APIstub, "role")
	if err != nil {
		// There was an error trying to retrieve the attribute
		shim.Error("Error while retriving attributes")
	}
	if !ok {
		// The client identity does not possess the attribute
		shim.Error("Client identity doesnot posses the attribute")
	}
	// Do something with the value of 'val'
	if val != "distributor" {
		fmt.Println("Attribute role: " + val)
		return shim.Error("Only user with role as Distributor have access this method!")
	} else {

		if len(args) != 2 {
			return shim.Error("Incorrect number of arguments. Expecting 2")
		}
	
		unitAsBytes, _ := APIstub.GetState(args[0])
		unit := Unit{}
	
		json.Unmarshal(unitAsBytes, &unit)
		
		unit.Location = args[1]
	
		unitAsBytes, _ = json.Marshal(unit)
		APIstub.PutState(args[0], unitAsBytes)
	
		return shim.Success(unitAsBytes)
}
}


func (s *SmartContract) restictedMethod(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	// get an ID for the client which is guaranteed to be unique within the MSP
	//id, err := cid.GetID(APIstub) -

	// get the MSP ID of the client's identity
	//mspid, err := cid.GetMSPID(APIstub) -

	// get the value of the attribute
	//val, ok, err := cid.GetAttributeValue(APIstub, "attr1") -

	// get the X509 certificate of the client, or nil if the client's identity was not based on an X509 certificate
	//cert, err := cid.GetX509Certificate(APIstub) -

	val, ok, err := cid.GetAttributeValue(APIstub, "role")
	if err != nil {
		// There was an error trying to retrieve the attribute
		shim.Error("Error while retriving attributes")
	}
	if !ok {
		// The client identity does not possess the attribute
		shim.Error("Client identity doesnot posses the attribute")
	}
	// Do something with the value of 'val'
	if val != "approver" {
		fmt.Println("Attribute role: " + val)
		return shim.Error("Only user with role as APPROVER have access this method!")
	} else {
		if len(args) != 1 {
			return shim.Error("Incorrect number of arguments. Expecting 1")
		}

		carAsBytes, _ := APIstub.GetState(args[0])
		return shim.Success(carAsBytes)
	}

}

// initialization

func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	units := []Unit{
	Unit{Unit_id:"Unit1",Name: "Sunpharma", Curr_Owner: "Ambani", Quantity: "80000", Manufacturer: "Sunpharma_A",Date:"12/09/21",Location:"Bandra",Remark:"None"},
	Unit{Unit_id:"Unit2",Name: "Cipla", Curr_Owner: "Birla", Quantity: "10000", Manufacturer: "Cipla_B",Date:"13/09/21",Location:"Nagpur",Remark:"None"},
	Unit{Unit_id:"Unit3",Name: "Dr_Reddy", Curr_Owner: "Tata", Quantity: "90000", Manufacturer: "Dr_Reddy_C",Date:"14/09/21",Location:"Mumbai",Remark:"None"},
	Unit{Unit_id:"Unit4",Name: "DibiLaboratory", Curr_Owner: "Mittal", Quantity: "20000", Manufacturer: "DibiLaboratory_D",Date:"15/09/21",Location:"Badlapur",Remark:"None"},
	Unit{Unit_id:"Unit5",Name: "JJ", Curr_Owner: "Modi", Quantity: "50000", Manufacturer: "JJ_E",Date:"16/09/21",Location:"Alibaug",Remark:"None"},
	}
	
	i := 1
	for i <= len(units) {
		unitAsBytes, _ := json.Marshal(units[i])
		APIstub.PutState("Unit"+strconv.Itoa(i), unitAsBytes)
		i = i + 1
	}
	
	return shim.Success(nil)
	}

// Car

// func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
// 	cars := []Car{
// 		Car{Make: "Toyota", Model: "Prius", Colour: "blue", Owner: "Tomoko"},
// 		Car{Make: "Ford", Model: "Mustang", Colour: "red", Owner: "Brad"},
// 		Car{Make: "Hyundai", Model: "Tucson", Colour: "green", Owner: "Jin Soo"},
// 		Car{Make: "Volkswagen", Model: "Passat", Colour: "yellow", Owner: "Max"},
// 		Car{Make: "Tesla", Model: "S", Colour: "black", Owner: "Adriana"},
// 		Car{Make: "Peugeot", Model: "205", Colour: "purple", Owner: "Michel"},
// 		Car{Make: "Chery", Model: "S22L", Colour: "white", Owner: "Aarav"},
// 		Car{Make: "Fiat", Model: "Punto", Colour: "violet", Owner: "Pari"},
// 		Car{Make: "Tata", Model: "Nano", Colour: "indigo", Owner: "Valeria"},
// 		Car{Make: "Holden", Model: "Barina", Colour: "brown", Owner: "Shotaro"},
// 	}

// 	i := 0
// 	for i < len(cars) {
// 		carAsBytes, _ := json.Marshal(cars[i])
// 		APIstub.PutState("CAR"+strconv.Itoa(i), carAsBytes)
// 		i = i + 1
// 	}

// 	return shim.Success(nil)
// }

// The main function is only relevant in unit test mode. Only included here for completeness.
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}