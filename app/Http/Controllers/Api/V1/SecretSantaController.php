<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSecretSantaRequest;
use App\Models\User;
use App\Notifications\YouSecretSantaNowNotification;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SecretSantaController extends Controller
{
    public function store(StoreSecretSantaRequest $request): Response
    {
        $user = $request->user();

        if ($user->hasSecretSanta()) {
            return response([
                'status' => 'failed',
                'message' => 'У тебя уже есть Санта'
            ], 422);
        }

        $santa = User::where('email', $request->email)->first();

        if ($user->id === $santa->user_id) {
            return response([
                'status' => 'failed',
                'message' => 'Этот Санта уже занят тобой'
            ], 422);
        }

        if ($user->email === $request->email) {
            return response([
                'status' => 'failed',
                'message' => 'Это ты сам'
            ], 422);
        }

        if ($santa->user_id !== null) {
            return response([
                'status' => 'failed',
                'message' => 'Этот Санта уже занят'
            ], 500);
        }

        DB::beginTransaction();
        try {
            $santa->recipient_id = $user->id;

            $santa->save();

            DB::commit();
        } catch (\Exception $exception) {
            DB::rollBack();

            Log::error('/api/v1/secret_santa/store :message', ['message' => $exception->getMessage()]);

            return response([
                'status' => 'failed',
                'message' => 'Ошибка сервера'
            ], 500);
        }

        $santa->notify(new YouSecretSantaNowNotification($user));

        return response([
            'status' => 'succeed',
            'message' => 'Ты выбрал себе Санту и ему отправлено уведомление в файл laravel.log',
            'you' => $user->email,
            'your_santa' => $santa->email
        ], 200);
    }

    /**
     * @param Request $request
     * @return Response
     */
    public function getAllAvailableUsers(Request $request): Response
    {
        $user_email = $request->user()->email;

        $users = User::select('email')
            ->whereNull('recipient_id')
            ->where('email', '!=', $user_email)
            ->get()
            ->pluck('email')
            ->toArray();

        return response([
            'status' => 'succeed',
            'users' => $users
        ], 200);
    }

    public function getSecretSantaEmail(Request $request): Response
    {
        $user = $request->user();

        $secret_santa = User::where('recipient_id',$user->id)->first();

        return response([
            'status' => 'succeed',
            'secret_santa_email' => $secret_santa->email ?? ''
        ], 200);
    }
}
