import os
import datetime

now = datetime.datetime.now()
formatted_date = now.strftime("%H:%M:%S %d.%m.%Y")

with open('production_build/.env', 'w') as env:
    env.write(f'NEXT_PUBLIC_API_URL={os.getenv('NEXT_PUBLIC_API_URL')}\n')
    env.write(f'NEXT_PUBLIC_GLOBAL_API_URL={os.getenv('NEXT_PUBLIC_GLOBAL_API_URL')}\n')
    env.write(f'NEXT_PUBLIC_COLORABLE_ID={os.getenv('NEXT_PUBLIC_COLORABLE_ID')}\n')
    env.write(f'NEXT_PUBLIC_LOGIN_URL={os.getenv('NEXT_PUBLIC_LOGIN_URL')}\n')
    env.write(f'TOKEN={os.getenv('TOKEN')}\n')
    env.write(f'NEXT_PUBLIC_BUILD_DATE={formatted_date}\n')

print('Successfully created .env file')
print('Build date:', formatted_date)
