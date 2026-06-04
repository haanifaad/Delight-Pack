@echo off
echo Building Flutter Customer App (Android & iOS)...

cd c:\Projects\dp\flutter_customer
echo Building Android App Bundle with Obfuscation...
call flutter build appbundle --release --obfuscate --split-debug-info=./debug_info/android

echo Building iOS IPA with Obfuscation...
call flutter build ipa --release --obfuscate --split-debug-info=./debug_info/ios

echo Building Flutter Admin App (Android & iOS)...
cd c:\Projects\dp\flutter_admin

echo Building Android App Bundle with Obfuscation...
call flutter build appbundle --release --obfuscate --split-debug-info=./debug_info/android

echo Building iOS IPA with Obfuscation...
call flutter build ipa --release --obfuscate --split-debug-info=./debug_info/ios

echo Flutter Compilation Complete.
pause
