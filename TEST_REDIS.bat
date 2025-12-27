@echo off
echo ========================================
echo   Redis 功能测试脚本
echo ========================================
echo.

echo [1/4] 测试 Redis 连接...
curl -X PATCH http://localhost:3000/api/redis-test
echo.
echo.

echo [2/4] 写入测试数据...
curl -X POST http://localhost:3000/api/redis-test -H "Content-Type: application/json" -d "{\"key\": \"test-item\", \"value\": \"Hello Redis from InvestAI\", \"ttl\": 3600}"
echo.
echo.

echo [3/4] 读取测试数据...
curl -X GET "http://localhost:3000/api/redis-test?key=test-item"
echo.
echo.

echo [4/4] 删除测试数据...
curl -X DELETE "http://localhost:3000/api/redis-test?key=test-item"
echo.
echo.

echo ========================================
echo   测试完成！
echo ========================================
echo.
echo 如果所有测试都返回 "success": true，说明 Redis 工作正常！
echo.
pause
