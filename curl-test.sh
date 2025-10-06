#!/bin/bash

# Base URL
BASE_URL="http://localhost:3000"

echo "=========================================="
echo "GET METRICS API - CURL TEST COMMANDS"
echo "=========================================="
echo ""

echo "1. Get All Metrics (with required date range)"
echo "-------------------------------------------"
echo "curl -X GET '$BASE_URL/api/metrics?startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z' \\"
echo "  -H 'user-id: user123'"
echo ""
curl -X GET "$BASE_URL/api/metrics?startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z" \
  -H "user-id: user123"
echo -e "\n"

echo "2. Get Metrics - Filter by Type (DISTANCE)"
echo "-------------------------------------------"
echo "curl -X GET '$BASE_URL/api/metrics?type=DISTANCE&startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z' \\"
echo "  -H 'user-id: user123'"
echo ""
curl -X GET "$BASE_URL/api/metrics?type=DISTANCE&startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z" \
  -H "user-id: user123"
echo -e "\n"

echo "3. Get Metrics - Filter by Type (TEMPERATURE)"
echo "-------------------------------------------"
echo "curl -X GET '$BASE_URL/api/metrics?type=TEMPERATURE&startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z' \\"
echo "  -H 'user-id: user456'"
echo ""
curl -X GET "$BASE_URL/api/metrics?type=TEMPERATURE&startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z" \
  -H "user-id: user456"
echo -e "\n"

echo "4. Get Metrics - With Unit Conversion (to FEET)"
echo "-------------------------------------------"
echo "curl -X GET '$BASE_URL/api/metrics?unit=FEET&startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z' \\"
echo "  -H 'user-id: user123'"
echo ""
curl -X GET "$BASE_URL/api/metrics?unit=FEET&startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z" \
  -H "user-id: user123"
echo -e "\n"

echo "5. Get Metrics - With Unit Conversion (to FAHRENHEIT)"
echo "-------------------------------------------"
echo "curl -X GET '$BASE_URL/api/metrics?unit=FAHRENHEIT&startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z' \\"
echo "  -H 'user-id: user456'"
echo ""
curl -X GET "$BASE_URL/api/metrics?unit=FAHRENHEIT&startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z" \
  -H "user-id: user456"
echo -e "\n"

echo "6. Get Metrics - All Filters + Unit Conversion"
echo "-------------------------------------------"
echo "curl -X GET '$BASE_URL/api/metrics?type=DISTANCE&unit=METER&startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z' \\"
echo "  -H 'user-id: user123'"
echo ""
curl -X GET "$BASE_URL/api/metrics?type=DISTANCE&unit=METER&startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z" \
  -H "user-id: user123"
echo -e "\n"

echo "7. Get Metrics - Specific Date Range"
echo "-------------------------------------------"
echo "curl -X GET '$BASE_URL/api/metrics?startDate=2024-01-15T00:00:00Z&endDate=2024-01-15T23:59:59Z' \\"
echo "  -H 'user-id: user123'"
echo ""
curl -X GET "$BASE_URL/api/metrics?startDate=2024-01-15T00:00:00Z&endDate=2024-01-15T23:59:59Z" \
  -H "user-id: user123"
echo -e "\n"

echo "=========================================="
echo "ERROR TEST CASES"
echo "=========================================="
echo ""

echo "8. Test Missing startDate (should fail)"
echo "-------------------------------------------"
echo "curl -X GET '$BASE_URL/api/metrics?endDate=2024-12-31T23:59:59Z' \\"
echo "  -H 'user-id: user123'"
echo ""
curl -X GET "$BASE_URL/api/metrics?endDate=2024-12-31T23:59:59Z" \
  -H "user-id: user123"
echo -e "\n"

echo "9. Test Missing endDate (should fail)"
echo "-------------------------------------------"
echo "curl -X GET '$BASE_URL/api/metrics?startDate=2024-01-01T00:00:00Z' \\"
echo "  -H 'user-id: user123'"
echo ""
curl -X GET "$BASE_URL/api/metrics?startDate=2024-01-01T00:00:00Z" \
  -H "user-id: user123"
echo -e "\n"

echo "10. Test Missing user-id header (should fail)"
echo "-------------------------------------------"
echo "curl -X GET '$BASE_URL/api/metrics?startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z'"
echo ""
curl -X GET "$BASE_URL/api/metrics?startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z"
echo -e "\n"

echo "11. Test Invalid Type (should fail)"
echo "-------------------------------------------"
echo "curl -X GET '$BASE_URL/api/metrics?type=INVALID&startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z' \\"
echo "  -H 'user-id: user123'"
echo ""
curl -X GET "$BASE_URL/api/metrics?type=INVALID&startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z" \
  -H "user-id: user123"
echo -e "\n"

echo "12. Test Invalid Unit (should fail)"
echo "-------------------------------------------"
echo "curl -X GET '$BASE_URL/api/metrics?unit=INVALID_UNIT&startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z' \\"
echo "  -H 'user-id: user123'"
echo ""
curl -X GET "$BASE_URL/api/metrics?unit=INVALID_UNIT&startDate=2024-01-01T00:00:00Z&endDate=2024-12-31T23:59:59Z" \
  -H "user-id: user123"
echo -e "\n"

echo "=========================================="
echo "TESTS COMPLETED"
echo "=========================================="

