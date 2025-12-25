@echo off
SETLOCAL EnableDelayedExpansion

:: ============================================================
:: CẤU HÌNH
:: ============================================================
SET CONTAINER_NAME=mypg
SET ADMIN_USER=admin
SET SQL_FILE=schema.sql

:: Thông tin cho dự án Web Tin Tức
SET NEWS_DB_NAME=libraryaidti_db
SET NEWS_DB_USER=libraryaidti_user
SET NEWS_DB_PASS=123456

ECHO ==========================================================
ECHO KHOI TAO DATABASE (CHAY QUA WSL)
ECHO Container: %CONTAINER_NAME%
ECHO File SQL:  %SQL_FILE%
ECHO ==========================================================

:: 1. Kiểm tra file .sql
IF NOT EXIST "%SQL_FILE%" (
    ECHO [LOI] Khong tim thay file "%SQL_FILE%"!
    PAUSE
    EXIT /B
)

:: 2. Dọn dẹp User/DB cũ
ECHO [1/5] Don dep User/DB cu (neu co)...

:: Ngắt kết nối (Thêm 'wsl' vào trước docker)
wsl docker exec -i %CONTAINER_NAME% psql -U %ADMIN_USER% -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '%NEWS_DB_NAME%' AND pid <> pg_backend_pid();" >nul 2>&1

:: Xóa DB và User
wsl docker exec -i %CONTAINER_NAME% psql -U %ADMIN_USER% -d postgres -c "DROP DATABASE IF EXISTS %NEWS_DB_NAME%;" >nul 2>&1
wsl docker exec -i %CONTAINER_NAME% psql -U %ADMIN_USER% -d postgres -c "DROP USER IF EXISTS %NEWS_DB_USER%;" >nul 2>&1

:: 3. Tạo User mới
ECHO [2/5] Tao User rieng: %NEWS_DB_USER%...
wsl docker exec -i %CONTAINER_NAME% psql -U %ADMIN_USER% -d postgres -c "CREATE USER %NEWS_DB_USER% WITH PASSWORD '%NEWS_DB_PASS%';"

:: 4. Tạo Database mới
ECHO [3/5] Tao Database rieng: %NEWS_DB_NAME%...
wsl docker exec -i %CONTAINER_NAME% psql -U %ADMIN_USER% -d postgres -c "CREATE DATABASE %NEWS_DB_NAME% OWNER %NEWS_DB_USER%;"

:: 5. Cấp quyền
wsl docker exec -i %CONTAINER_NAME% psql -U %ADMIN_USER% -d postgres -c "GRANT ALL PRIVILEGES ON DATABASE %NEWS_DB_NAME% TO %NEWS_DB_USER%;" >nul 2>&1

:: 6. Nạp dữ liệu (Quan trọng: Pipe từ Windows vào WSL)
ECHO [4/5] Dang nap du lieu tu file %SQL_FILE%...
type "%SQL_FILE%" | wsl docker exec -i %CONTAINER_NAME% psql -U %NEWS_DB_USER% -d %NEWS_DB_NAME%

ECHO.
ECHO ==========================================================
ECHO [HOAN TAT] Database da duoc reset thanh cong tren WSL!
ECHO ==========================================================

PAUSE