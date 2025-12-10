<?php

namespace App\Services\Auth;
use App\Models\User;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Hash;

/**
 * Service class to handle User authentication and token management.
 */
class UserService
{
    /**
     * Authenticate an admin using email and password.
     *
     * @param  User   $User    The User model (already fetched)
     * @param  string  $password
     * @return User
     * @throws AuthenticationException
     */
    public function authenticate(User $User, string $password): User
    {
        // If password does not match, throw exception
        if (! Hash::check($password, $User->password)) {
            throw new AuthenticationException('Invalid credentials');
        }

        return $User;
    }
    /**
     * Logout the User by revoking current access token.
     *
     * @param  User  $User
     * @return void
     */
    public function logout(User $User): void
    {
        // Revoke token used for this request
        $User->currentAccessToken()?->delete();
    }
}
